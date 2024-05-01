import type { Express } from 'express'
import { Redis } from 'ioredis'
import pino, { type Logger } from 'pino'
import { baseSepolia, optimismSepolia, sepolia, zoraSepolia } from 'viem/chains'

import { fraxtalSepolia } from '@/constants/fraxtalSepolia'
import { runMigrations } from '@/db/Database'
import { envVars } from '@/envVars'
import { BackendReadinessState } from '@/helpers/BackendReadinessState'
import { initializeApiServer } from '@/initializeApiServer'
import { metrics } from '@/monitoring/metrics'
import { getAlchemyPaymasterConfig } from '@/paymaster/alchemy/getAlchemyPaymasterConfig'
import type { PaymasterConfig } from '@/paymaster/types'
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

    const paymasterConfigs = [
      getAlchemyPaymasterConfig({
        chain: sepolia,
        rpcUrl: envVars.ALCHEMY_RPC_URL_SEPOLIA,
        policyId: envVars.ALCHEMY_GAS_MANAGER_POLICY_ID_SEPOLIA,
      }),
      getAlchemyPaymasterConfig({
        chain: optimismSepolia,
        rpcUrl: envVars.ALCHEMY_RPC_URL_OP_SEPOLIA,
        policyId: envVars.ALCHEMY_GAS_MANAGER_POLICY_ID_OP_SEPOLIA,
      }),
      getAlchemyPaymasterConfig({
        chain: baseSepolia,
        rpcUrl: envVars.ALCHEMY_RPC_URL_BASE_SEPOLIA,
        policyId: envVars.ALCHEMY_GAS_MANAGER_POLICY_ID_BASE_SEPOLIA,
      }),
      getAlchemyPaymasterConfig({
        chain: zoraSepolia,
        rpcUrl: envVars.ALCHEMY_RPC_URL_ZORA_SEPOLIA,
        policyId: envVars.ALCHEMY_GAS_MANAGER_POLICY_ID_ZORA_SEPOLIA,
      }),
      getAlchemyPaymasterConfig({
        chain: fraxtalSepolia,
        rpcUrl: envVars.ALCHEMY_RPC_URL_FRAXTAL_SEPOLIA,
        policyId: envVars.ALCHEMY_GAS_MANAGER_POLICY_ID_FRAXTAL_SEPOLIA,
      }),
    ] as const satisfies PaymasterConfig[]

    const backendReadinessState = new BackendReadinessState()

    const apiServer = await initializeApiServer({
      redisClient,
      paymasterConfigs,
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
