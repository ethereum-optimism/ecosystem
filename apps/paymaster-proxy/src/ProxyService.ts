import type { Express } from 'express'
import { Redis } from 'ioredis'
import pino, { type Logger } from 'pino'

import { initializeAdminApiServer } from '@/adminApi/initializeAdminApiServer'
import { initializeApiServer } from '@/api/initializeApiServer'
import { createApiKeyServiceClient } from '@/apiKeyService/createApiKeyServiceClient'
import { connectToDatabase, runMigrations } from '@/db/Database'
import { envVars } from '@/envVars'
import { BackendReadinessState } from '@/helpers/BackendReadinessState'
import { metrics } from '@/monitoring/metrics'
import { retryWithBackoff } from '@/utils/retryWithBackoff'

const HOST = '0.0.0.0'

export class ProxyService {
  private readonly apiServer: Express
  private readonly adminApiServer: Express | null
  private readonly logger: Logger
  private readonly backendReadinessState: BackendReadinessState

  constructor(
    apiServer: Express,
    adminApiServer: Express | null,
    logger: Logger,
    backendReadinessState: BackendReadinessState,
  ) {
    this.apiServer = apiServer
    this.adminApiServer = adminApiServer
    this.logger = logger
    this.backendReadinessState = backendReadinessState
  }

  static async init() {
    const redisClient = new Redis(envVars.REDIS_URL)

    const logger = pino()

    const backendReadinessState = new BackendReadinessState()

    const database = connectToDatabase({
      user: envVars.DB_USER,
      password: envVars.DB_PASSWORD,
      database: envVars.DB_NAME,
      host: envVars.DB_HOST,
      port: envVars.DB_PORT,
      max: envVars.DB_MAX_CONNECTIONS,
    })

    const apiKeyServiceClient = createApiKeyServiceClient({
      url: envVars.API_KEY_SERVICE_URL,
    })

    const apiServer = await initializeApiServer({
      redisClient,
      metrics,
      logger: logger.child({
        namespace: 'api-server',
      }),
      backendReadinessState,
      database,
      apiKeyServiceClient,
    })

    const adminApiServer = envVars.SHOULD_ENABLE_ADMIN_API
      ? await initializeAdminApiServer({
          redisClient,
          metrics,
          logger: logger.child({
            namespace: 'admin-api-server',
          }),
          backendReadinessState,
          database,
          apiKeyServiceClient,
        })
      : null

    return new ProxyService(
      apiServer,
      adminApiServer,
      logger,
      backendReadinessState,
    )
  }

  async run() {
    this.apiServer.listen(envVars.PORT, HOST, () => {
      this.logger.info(`API server listening at http://${HOST}:${envVars.PORT}`)
    })

    if (envVars.SHOULD_ENABLE_ADMIN_API && this.adminApiServer) {
      this.adminApiServer.listen(envVars.ADMIN_API_PORT, HOST, () => {
        this.logger.info(
          `Admin API server listening at http://${HOST}:${envVars.ADMIN_API_PORT}`,
        )
      })
    }

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
