import { Server as CcipServer } from '@chainlink/ccip-read-server'
import { abi as Resolver_abi } from '@ensdomains/ens-contracts/artifacts/contracts/resolvers/Resolver.sol/Resolver.json'
import { abi as IResolverService_abi } from '@ensdomains/offchain-resolver-contracts/artifacts/contracts/OffchainResolver.sol/IResolverService.json'
import bodyParser from 'body-parser'
import type { BytesLike } from 'ethers'
import { ethers } from 'ethers'
import type { Result } from 'ethers/lib/utils'
import { hexConcat } from 'ethers/lib/utils'
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
import { corsAllowlist, envVars, ETH_COIN_TYPE } from './constants'
import { connectToDatabase, runMigrations } from './db'
import { NameDatabaseInterface } from './db/NameDatabaseInterface'
import { metrics } from './monitoring/metrics'
import { NameRoute } from './routes'
import { Trpc } from './Trpc'
import { retryWithBackoff } from './utils'

const API_PATH = '/api'

const HOST = '0.0.0.0'

export class Service {
  private static readonly LOG_TAG = '[NamingService]'

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
    const db = connectToDatabase({
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

    const logger = pino().child({
      namespace: 'naming-service-server',
    })

    const nameRoute = new NameRoute(trpc, db)

    /**
     * The apiServer simply assmbles the routes into a TRPC Server
     */
    const apiServer = new ApiV0(trpc, { nameRoute })
    apiServer.setLoggingServer(logger)

    const adminServer = new AdminApi(trpc, {})
    adminServer.setLoggingServer(logger)

    const service = new Service(apiServer, middleware, logger, adminServer)

    return service
  }

  public async run(): Promise<void> {
    // Start the app server if not yet running.
    if (!this.server) {
      this.logger.info('starting server')
      const address = ethers.utils.computeAddress(envVars.RESOLVER_PRIVATE_KEY)
      this.logger.info(`naming service using signing address ${address}`)
      const signer = new ethers.utils.SigningKey(envVars.RESOLVER_PRIVATE_KEY)
      const db = connectToDatabase({
        user: envVars.DB_USER,
        password: envVars.DB_PASSWORD,
        database: envVars.DB_NAME,
        host: envVars.DB_HOST,
        port: envVars.DB_PORT,
        max: envVars.DB_MAX_CONNECTIONS,
      })

      const nameDb = new NameDatabaseInterface(db, parseInt('300'))
      // Start building the app.
      const app = makeApp(signer, '/', nameDb)

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
    // router.use(this.middleware.cors)
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

const Resolver = new ethers.utils.Interface(Resolver_abi)

type PromiseOrResult<T> = T | Promise<T>

function decodeDnsName(dnsname: Buffer) {
  const labels = []
  let idx = 0
  while (true) {
    const len = dnsname.readUInt8(idx)
    if (len === 0) break
    labels.push(dnsname.slice(idx + 1, idx + len + 1).toString('utf8'))
    idx += len + 1
  }
  return labels.join('.')
}

interface DatabaseResult {
  result: any[]
  ttl: number
}

export interface DatabaseInterface {
  addr(
    name: string,
    coinType: number,
  ): PromiseOrResult<{ addr: string; ttl: number }>
  text(
    name: string,
    key: string,
  ): PromiseOrResult<{ value: string; ttl: number }>
  contenthash(
    name: string,
  ): PromiseOrResult<{ contenthash: string; ttl: number }>
}

const queryHandlers: {
  [key: string]: (
    db: DatabaseInterface,
    name: string,
    args: Result,
  ) => Promise<DatabaseResult>
} = {
  'addr(bytes32)': async (db, name, _args) => {
    const { addr, ttl } = await db.addr(name, ETH_COIN_TYPE)
    return { result: [addr], ttl }
  },
  'addr(bytes32,uint256)': async (db, name, args) => {
    const { addr, ttl } = await db.addr(name, args[0])
    return { result: [addr], ttl }
  },
  'text(bytes32,string)': async (db, name, args) => {
    const { value, ttl } = await db.text(name, args[0])
    return { result: [value], ttl }
  },
  'contenthash(bytes32)': async (db, name, _args) => {
    const { contenthash, ttl } = await db.contenthash(name)
    return { result: [contenthash], ttl }
  },
}

async function query(
  db: DatabaseInterface,
  name: string,
  data: string,
): Promise<{ result: BytesLike; validUntil: number }> {
  // Parse the data nested inside the second argument to `resolve`
  const { signature, args } = Resolver.parseTransaction({ data })

  if (ethers.utils.nameprep(name) !== name) {
    throw new Error('Name must be normalised')
  }

  if (ethers.utils.namehash(name) !== args[0]) {
    throw new Error('Name does not match namehash')
  }

  const handler = queryHandlers[signature]
  if (handler === undefined) {
    throw new Error(`Unsupported query function ${signature}`)
  }

  const { result, ttl } = await handler(db, name, args.slice(1))
  return {
    result: Resolver.encodeFunctionResult(signature, result),
    validUntil: Math.floor(Date.now() / 1000 + ttl),
  }
}

export function makeServer(
  signer: ethers.utils.SigningKey,
  db: DatabaseInterface,
) {
  const server = new CcipServer()
  server.add(IResolverService_abi, [
    {
      type: 'resolve',
      func: async ([encodedName, data]: Result, request) => {
        const name = decodeDnsName(Buffer.from(encodedName.slice(2), 'hex'))
        // Query the database
        const { result, validUntil } = await query(db, name, data)

        // Hash and sign the response
        const messageHash = ethers.utils.solidityKeccak256(
          ['bytes', 'address', 'uint64', 'bytes32', 'bytes32'],
          [
            '0x1900',
            request?.to,
            validUntil,
            ethers.utils.keccak256(request?.data || '0x'),
            ethers.utils.keccak256(result),
          ],
        )
        const sig = signer.signDigest(messageHash)
        const sigData = hexConcat([sig.r, sig._vs])
        return [result, validUntil, sigData]
      },
    },
  ])
  return server
}

export function makeApp(
  signer: ethers.utils.SigningKey,
  path: string,
  db: DatabaseInterface,
) {
  return makeServer(signer, db).makeApp(path)
}
