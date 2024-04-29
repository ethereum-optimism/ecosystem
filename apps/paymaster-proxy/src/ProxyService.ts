import type { Express } from 'express'
import { Redis } from 'ioredis'
import pino, { type Logger } from 'pino'

import { runMigrations } from '@/db/Database'
import { envVars } from '@/envVars'
import { BackendReadinessState } from '@/helpers/BackendReadinessState'
import { initializeApiServer } from '@/initializeApiServer'
import { metrics } from '@/monitoring/metrics'
import { retryWithBackoff } from '@/utils/retryWithBackoff'

const HOST = '0.0.0.0'

export class ProxyService {
  private readonly apiServer: Express
  private readonly logger: Logger
  private readonly backendReadinessState: BackendReadinessState

  constructor(
    apiServer: Express,
    logger: Logger,
    backendReadinessState: BackendReadinessState,
  ) {
    this.apiServer = apiServer
    this.logger = logger
    this.backendReadinessState = backendReadinessState
  }

  static async init() {
    const redisClient = new Redis(envVars.REDIS_URL)

    const logger = pino()

    const backendReadinessState = new BackendReadinessState()

    const apiServer = await initializeApiServer({
      redisClient,
      metrics,
      logger: logger.child({
        namespace: 'api-server',
      }),
      backendReadinessState,
    })

    return new ProxyService(apiServer, logger, backendReadinessState)
  }

  async run() {
    this.apiServer.listen(envVars.PORT, HOST, () => {
      this.logger.info(`API server listening at http://${HOST}:${envVars.PORT}`)
    })

    if (envVars.MIGRATE_DB_USER) {
      await retryWithBackoff({
        fn: () =>
          runMigrations({
            user: envVars.MIGRATE_DB_USER,
            password: envVars.MIGRATE_DB_PASSWORD,
            database: envVars.DB_NAME,
            host: envVars.DB_HOST,
            port: envVars.DB_PORT,
          }),
        maxRetries: envVars.MIGRATE_MAX_RETRIES,
        initialDelayMs: envVars.MIGRATE_INITIAL_RETRY_DELAY,
        maxDelayMs: envVars.MIGRATE_MAX_RETRY_DELAY,
        onRetry: (retryCount, error) =>
          this.logger.error(
            `migrations failed: ${error.message}, retrying in ${retryCount} seconds`,
          ),
      }).catch((e) => {
        this.logger.error(`migrations failed: ${e.message}`, e)
        throw e
      })
      this.logger.info('successfully ran migrations')
      this.backendReadinessState.setIsReady()
    }
  }
}
