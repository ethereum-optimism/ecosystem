import type { Express } from 'express'
import { Redis } from 'ioredis'
import pino from 'pino'
import { optimismSepolia, sepolia } from 'viem/chains'

import { envVars } from '@/envVars'
import { initializeApiServer } from '@/initializeApiServer'
import { metrics } from '@/monitoring/metrics'
import { getAlchemyPaymasterConfig } from '@/paymaster/alchemy/getAlchemyPaymasterConfig'
import type { PaymasterConfig } from '@/paymaster/types'

const HOST = '0.0.0.0'

export class ProxyService {
  private readonly apiServer: Express

  constructor(apiServer: Express) {
    this.apiServer = apiServer
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
    ] as const satisfies PaymasterConfig[]

    const apiServer = await initializeApiServer({
      redisClient,
      paymasterConfigs,
      metrics,
      logger: logger.child({
        namespace: 'api-server',
      }),
    })

    return new ProxyService(apiServer)
  }

  async run() {
    this.apiServer.listen(envVars.PORT, HOST, () => {
      console.log(`API server listening at http://${HOST}:${envVars.PORT}`)
    })
  }
}
