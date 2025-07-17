import { App } from '@eth-optimism/utils-app'
import { serve } from '@hono/node-server'
import { Option } from 'commander'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

import { env } from '@/config/env.js'
import { initializeVerbs } from '@/config/verbs.js'
import { verbsMiddleware } from '@/middleware/verbs.js'
import { router } from '@/router.js'

class VerbsApp extends App {
  private server: ReturnType<typeof serve> | null = null

  constructor() {
    super({
      name: 'verbs-service',
      version: '0.0.1',
      description: 'Hono service for verbs SDK',
    })
  }

  protected additionalOptions(): Option[] {
    return [
      new Option('--port <port>', 'port to run the service on')
        .default(env.PORT.toString())
        .env('PORT'),
    ]
  }

  protected async preMain(): Promise<void> {
    // Initialize Verbs SDK once at startup
    initializeVerbs()
  }

  protected async main(): Promise<void> {
    const app = new Hono()

    // Enable CORS for frontend communication
    app.use(
      '*',
      cors({
        origin: ['http://localhost:5173', 'http://localhost:3000'],
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'Authorization'],
      }),
    )

    // Apply Verbs middleware (initialization already happened at startup)
    app.use('*', verbsMiddleware)
    app.route('/', router)

    this.logger.info('starting verbs service on port %s', this.options.port)

    this.server = serve({
      fetch: app.fetch,
      port: Number(this.options.port),
    })

    while (!this.isShuttingDown) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }

  protected async shutdown(): Promise<void> {
    if (this.server) {
      return new Promise((resolve, reject) => {
        this.logger.info('stopping verbs service...')
        this.server!.close((error) => {
          if (error) {
            this.logger.error({ error }, 'error closing verbs service')
            reject(error)
          } else {
            resolve()
          }
        })
      })
    }
  }
}

export { VerbsApp }
