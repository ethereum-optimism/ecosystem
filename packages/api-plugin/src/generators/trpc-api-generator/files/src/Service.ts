import bodyParser from 'body-parser'
import type { Router } from 'express'
import express from 'express'
import type { Server } from 'net'

import { ApiV0, Middleware } from './api'
import { envVars } from './constants'
import { Trpc } from './Trpc'

export class Service {
  /**
   * App server.
   */
  private server?: Server

  /**
   * @param state - the state object that stores cached delegate chain data
   * @param middleware - The middleware specifying cors
   * @param apiServerV0 - the api server served at /api/v0
   */
  constructor(
    private readonly apiServerV0: ApiV0,
    private readonly middleware: Middleware,
  ) {}

  /**
   * @returns service with all dependencies injected
   */
  public static readonly init = async () => {
    /**
     * middleware used by the express server
     */
    const middleware = new Middleware()
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

      app.use('/api', router)

      app.get('/healthz', (req, res) => {
        res.json({ ok: true })
      })

      app.get('/ready', (req, res) => {
        // TODO: add check for whether underlying services are ready
        res.json({ ok: true })
      })

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
    }
  }

  private readonly routes = async (router: Router) => {
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
