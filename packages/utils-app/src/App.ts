import type { OptionValues } from 'commander'
import { Command, Option } from 'commander'
import { createServer } from 'http'
import type { Logger } from 'pino'
import { pino } from 'pino'
import { Registry } from 'prom-client'

export interface Config {
  name: string
  version: string
  description?: string
}

export abstract class App {
  protected readonly program: Command
  protected readonly metricsRegistry: Registry

  protected logger!: Logger
  protected options!: OptionValues

  private isShuttingDown = false
  private metricsServer: ReturnType<typeof createServer> | null = null

  constructor(config: Config) {
    this.program = new Command()
    this.metricsRegistry = new Registry()

    // Setup program (remove shorthands for help & version)
    this.program
      .name(config.name)
      .helpOption('--help', 'show help')
      .version(config.version, '--version', 'show version')
      .description(config.description || '')

    // Common options
    this.program
      .addOption(
        new Option('--log-level <level>', 'Set log level')
          .default('debug')
          .choices(['debug', 'info', 'warn', 'error', 'silent'])
          .env('LOG_LEVEL'),
      )
      .addOption(
        new Option('--metrics-enabled', 'Enable metrics collection')
          .default(false)
          .env('METRICS_ENABLED'),
      )
      .addOption(
        new Option('--metrics-port <port>', 'Port for metrics server')
          .default('7300')
          .env('METRICS_PORT'),
      )

    // Register additional options
    for (const option of this.additionalOptions()) {
      this.program.addOption(option)
    }

    // Setup signal handlers
    this.__setupSignalHandlers()
  }

  public async run(): Promise<void> {
    try {
      // Parse arguments
      this.program.parse()
      this.options = this.program.opts()

      // Setup Logger & Metrics Registry
      this.logger = pino({
        level: this.options.logLevel,
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: true,
            ignore: 'pid,hostname',
          },
        },
      })

      this.logger.info('starting application...')

      // Start metrics server if enabled
      if (this.options.metricsEnabled) {
        await this.__startMetricsServer(this.options.metricsPort)
      }

      // Run pre-main hook
      await this.preMain()

      // Run main hook
      await this.main()

      // Run post-main hook
      await this.postMain()

      // Run shutdown
      await this.__shutdown()

      this.logger.info('application completed successfully')
    } catch (error) {
      this.logger.error({ err: error }, 'application failed')
      process.exit(1)
    }
  }

  /** Optional options to add to the program */
  protected additionalOptions(): Option[] {
    return []
  }

  /** Optional hook to run before the main function, after parsing arguments */
  protected async preMain(): Promise<void> {}
  /** Optional hook to run after main returns */
  protected async postMain(): Promise<void> {}
  /** Optional hook to run on interruption */
  protected async shutdown(): Promise<void> {}

  private async __startMetricsServer(port: string): Promise<void> {
    this.metricsServer = createServer(async (req, res) => {
      if (req.url === '/metrics') {
        res.setHeader('Content-Type', this.metricsRegistry.contentType)
        res.end(await this.metricsRegistry.metrics())
      } else {
        res.statusCode = 404
        res.end('Not found')
      }
    })

    this.logger.info(`starting metrics server on port :${port}`)
    this.metricsServer.listen(port, () => {})
  }

  private async __stopMetricsServer(): Promise<void> {
    if (this.metricsServer) {
      return new Promise((resolve, reject) => {
        this.logger.info('stopping metrics server...')
        this.metricsServer!.close((err) => {
          if (err) {
            reject(new Error(`failed stopping metrics server: ${err}`))
          } else {
            resolve()
          }
        })
      })
    }
  }

  private __setupSignalHandlers() {
    const signals = ['SIGINT', 'SIGTERM'] as const
    let shutdownCount = 0

    signals.forEach((signal) => {
      process.on(signal, async () => {
        this.logger.info(`received ${signal}, shutting down...`)

        shutdownCount++
        if (this.isShuttingDown && shutdownCount > 5) {
          this.logger.warn('forcing shutdown')
          process.exit(1)
        }

        try {
          await this.__shutdown()
        } catch (error) {
          this.logger.error({ error }, 'error during shutdown')
          process.exitCode = 1
        }
      })
    })
  }

  private async __shutdown(): Promise<void> {
    if (this.isShuttingDown) return
    this.isShuttingDown = true

    // shutdown processes
    await Promise.allSettled([this.shutdown(), this.__stopMetricsServer()])
  }

  protected abstract main(): Promise<void>
}
