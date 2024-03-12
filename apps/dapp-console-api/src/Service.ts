import bodyParser from 'body-parser'
import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
  Router,
} from 'express'
import express from 'express'
import promBundle from 'express-prom-bundle'
import morgan from 'morgan'
import type { Server } from 'net'
import type { Logger } from 'pino'
import pino from 'pino'
import type { Registry } from 'prom-client'
import prometheus from 'prom-client'

import { ApiV0, Middleware } from './api'
import { AdminApi } from './api/AdminApi'
import { ensureAdmin } from './auth'
import { corsAllowlist, envVars } from './constants'
import { connectToDatabase, runMigrations } from './db'
import { metrics } from './monitoring/metrics'
import { Trpc } from './Trpc'
import { retryWithBackoff } from './utils'

const API_PATH = '/api'

const HOST = '0.0.0.0'

export class Service {
  private static readonly LOG_TAG = '[DappConsoleApiService]'
  /**
   * App server.
   */
  private server?: Server

  /**
   * Registry for prometheus metrics.
   */
  private metricsRegistry: Registry

  /**
   * @param state - the state object that stores cached delegate chain data
   * @param middleware - The middleware specifying cors
   * @param apiServerV0 - the api server served at /api/v0
   */
  constructor(
    private readonly apiServerV0: ApiV0,
    private readonly middleware: Middleware,
    private readonly logger: Logger,
    private readonly adminServer: AdminApi,
  ) {
    // Create the metrics server.
    this.metricsRegistry = prometheus.register
    prometheus.collectDefaultMetrics({
      register: this.metricsRegistry,
      labels: { version: this.apiServerV0.version },
    })

    // Gracefully handle stop signals.
    const maxSignalCount = 3
    let currSignalCount = 0
    const stop = async (signal: string) => {
      // Allow exiting fast if more signals are received.
      currSignalCount++
      if (currSignalCount === 1) {
        this.logger.info(`stopping service with signal`, { signal })
        await this.stop()
        process.exit(0)
      } else if (currSignalCount >= maxSignalCount) {
        this.logger.info(`performing hard stop`)
        process.exit(0)
      } else {
        this.logger.info(
          `send ${
            maxSignalCount - currSignalCount
          } more signal(s) to hard stop`,
        )
      }
    }

    // Handle stop signals.
    process.on('SIGTERM', stop)
    process.on('SIGINT', stop)
  }

  /**
   * @returns service with all dependencies injected
   */
  public static readonly init = async () => {
    // TODO remove this disable after this variable is used.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const appDB = connectToDatabase({
      user: envVars.DB_USER,
      password: envVars.DB_PASSWORD,
      database: envVars.DB_NAME,
      host: envVars.DB_HOST,
      port: envVars.DB_PORT,
      max: envVars.DB_MAX_CONNECTIONS,
    })

    /**
     * middleware used by the express server
     */
    const middleware = new Middleware(corsAllowlist)
    /**
     * Routes and controllers are created with trpc
     */
    const trpc = new Trpc()

    /**
     * The apiServer simply assmbles the routes into a TRPC Server
     */
    const apiServer = new ApiV0(trpc, {})

    const logger = pino().child({
      namespace: 'api-server',
    })

    const adminServer = new AdminApi(trpc, {})

    const service = new Service(apiServer, middleware, logger, adminServer)

    return service
  }

  public async run(): Promise<void> {
    if (envVars.MIGRATE_DB_USER) {
      try {
        await retryWithBackoff(
          () =>
            runMigrations({
              user: envVars.MIGRATE_DB_USER,
              password: envVars.MIGRATE_DB_PASSWORD,
              database: envVars.DB_NAME,
              host: envVars.DB_HOST,
              port: envVars.DB_PORT,
            }),
          envVars.MIGRATE_MAX_RETRIES,
          envVars.MIGRATE_INITIAL_RETRY_DELAY,
          envVars.MIGRATE_MAX_RETRY_DELAY,
        )
        this.logger.info('successfully ran migrations')
      } catch (e) {
        this.logger.error(
          `${Service.LOG_TAG} migrations failed: ${e.message}`,
          e,
        )
        throw e
      }
    }

    // Start the app server if not yet running.
    if (!this.server) {
      this.logger.info('starting server')
      // Start building the app.
      const app = express()

      // Body parsing.
      app.use(bodyParser.urlencoded({ extended: true }))

      // Keep the raw body around in case the application needs it.
      app.use(
        bodyParser.json({
          verify: (req, res, buf, encoding) => {
            ;(req as any).rawBody =
              buf?.toString((encoding as BufferEncoding) || 'utf8') || ''
          },
        }),
      )

      // Logging.
      app.use(
        morgan('short', {
          stream: {
            write: (str: string) => {
              this.logger.info(
                {
                  log: str,
                },
                'server log',
              )
            },
          },
        }),
      )

      // Register user routes.
      const router = express.Router()
      this.routes(router)

      const healthzPath = '/healthz'
      const readyPath = '/ready'

      // Metrics.
      // Will expose a /metrics endpoint by default.
      app.use(
        promBundle({
          promRegistry: this.metricsRegistry,
          includeMethod: true,
          includePath: true,
          includeStatusCode: true,
          normalizePath: (req, opts) => {
            const urlPath = `${req.baseUrl}${req.path}`
            if (urlPath === healthzPath || urlPath === readyPath) {
              return promBundle.normalizePath(req, opts)
            }

            for (const layer of router.stack) {
              if (layer.route && urlPath.match(layer.regexp)) {
                return promBundle.normalizePath(req, opts)
              }
            }

            return '/invalid_path_not_a_real_route'
          },
        }),
      )

      app.use(API_PATH, router)

      app.get(healthzPath, (req, res) => {
        res.json({ ok: true })
      })

      app.get(readyPath, (req, res) => {
        // TODO: add check for whether underlying services are ready
        res.json({ ok: true })
      })

      // Default error handler
      app.use(((
        err: Error,
        req: Request,
        res: Response,
        next: NextFunction,
      ) => {
        this.logger.error(err, 'Unhandled error')
        metrics.unhandledApiServerErrorCount.inc({
          apiVersion: this.apiServerV0.version,
        })
        res.status(500).send()
      }) satisfies ErrorRequestHandler)

      // Wait for server to come up.
      await new Promise((resolve) => {
        this.server = app.listen(envVars.PORT, HOST, () => {
          resolve(null)
        })
      })

      this.logger.info(
        {
          port: envVars.PORT,
          hostname: HOST,
        },
        `app server started`,
      )
    }
  }

  /**
   * Tries to gracefully stop the service. Service will continue running until the current loop
   * iteration is finished and will then stop looping.
   */
  public async stop(): Promise<void> {
    if (this.server) {
      this.logger.info('stopping server')
      await new Promise((resolve) => {
        this.server!.close(() => {
          resolve(null)
        })
      })
      this.logger.info('server stopped')
      this.server = undefined
    }
  }

  private readonly routes = async (router: Router) => {
    router.use(this.middleware.cors)
    // These handlers do nothing. they pass on the request to the next handler.
    // They are a hack I added because our trpc middleware does not expose the supported routes
    // in the canonical way and we need a way to filter invalid request paths from being logged to
    // our metrics server since this is a DoS attack vector.
    this.apiServerV0.getSupportedPaths().forEach((path) => {
      router.all(
        `${API_PATH}${this.apiServerV0.expressRoute}${path}`,
        (req, res, next) => next(),
      )
    })
    router.all(
      `${API_PATH}${this.apiServerV0.playgroundEndpoint}`,
      (req, res, next) => next(),
    )

    // user facing
    router.use(
      this.apiServerV0.expressRoute,
      this.apiServerV0.createExpressMiddleware(),
    )
    router.use(
      this.apiServerV0.playgroundEndpoint,
      ensureAdmin(),
      await this.apiServerV0.playgroundHandler(),
    )

    // admin
    await this.adminServer.registerRoutes(router)
  }
}
