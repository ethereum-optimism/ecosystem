import type { Express } from 'express'
import { Redis } from 'ioredis'
import pino, { type Logger } from 'pino'
import { baseSepolia, optimismSepolia, sepolia, zoraSepolia } from 'viem/chains'

import { fraxtalSepolia } from '@/constants/fraxtalSepolia'
import { envVars } from '@/envVars'
import { initializeApiServer } from '@/initializeApiServer'
import { metrics } from '@/monitoring/metrics'
import { getAlchemyPaymasterConfig } from '@/paymaster/alchemy/getAlchemyPaymasterConfig'
import type { PaymasterConfig } from '@/paymaster/types'

const HOST = '0.0.0.0'

export class ProxyService {
  private readonly apiServer: Express
  private readonly logger: Logger

  constructor(apiServer: Express, logger: Logger) {
    this.apiServer = apiServer
    this.logger = logger
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

    const apiServer = await initializeApiServer({
      redisClient,
      paymasterConfigs,
      metrics,
      logger: logger.child({
        namespace: 'api-server',
      }),
    })

    return new ProxyService(apiServer, logger)
  }

  async run() {
    this.apiServer.listen(envVars.PORT, HOST, () => {
      this.logger.info(`API server listening at http://${HOST}:${envVars.PORT}`)
    })
  }
}
