import { App } from '@eth-optimism/utils-app'
import { serve } from '@hono/node-server'
import { Option } from 'commander'
import { Hono } from 'hono'

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
        .default('3000')
        .env('PORT'),
    ]
  }

  protected async main(): Promise<void> {
    const app = new Hono()

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
