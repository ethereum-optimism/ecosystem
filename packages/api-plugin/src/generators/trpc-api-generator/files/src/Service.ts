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
import type { Server } from 'net'
import type { Registry } from 'prom-client'
import prometheus from 'prom-client'

import { ApiV0, Middleware } from './api'
import { corsAllowlist, envVars } from './constants'
import { metrics } from './monitoring/metrics'
import { Trpc } from './Trpc'

const API_PATH = '/api'

export class Service {
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
    const stop = async () => {
      // Allow exiting fast if more signals are received.
      currSignalCount++
      if (currSignalCount === 1) {
        await this.stop()
        process.exit(0)
      } else if (currSignalCount >= maxSignalCount) {
        process.exit(0)
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

    const service = new Service(apiServer, middleware)

    return service
  }

  public async run(): Promise<void> {
    // Start the app server if not yet running.
    if (!this.server) {
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

      // TODO add logging

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
        // TODO add logging
        metrics.unhandledApiServerErrorCount.inc({
          apiVersion: this.apiServerV0.version,
        })
        res.status(500).send()
      }) satisfies ErrorRequestHandler)

      // Wait for server to come up.
      await new Promise((resolve) => {
        this.server = app.listen(envVars.PORT, () => {
          resolve(null)
        })
      })
    }
  }

  /**
   * Tries to gracefully stop the service. Service will continue running until the current loop
   * iteration is finished and will then stop looping.
   */
  public async stop(): Promise<void> {
    if (this.server) {
      await new Promise((resolve) => {
        this.server!.close(() => {
          resolve(null)
        })
      })
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
      // TODO add admin check
      await this.apiServerV0.playgroundHandler(),
    )
  }
}
