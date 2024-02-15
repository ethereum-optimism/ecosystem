import type { Express } from 'express'
import { Redis } from 'ioredis'
import { optimismSepolia, sepolia } from 'viem/chains'

import { envVars } from '@/envVars'
import { initializeApiServer } from '@/initializeApiServer'
import { getAlchemyPaymasterConfig } from '@/paymaster/getAlchemyPaymasterConfig'
import type { PaymasterConfig } from '@/paymaster/types'

const HOST = '0.0.0.0'

export class ProxyService {
  private readonly apiServer: Express

  constructor(apiServer: Express) {
    this.apiServer = apiServer
  }

  static async init() {
    const redisClient = new Redis(envVars.REDIS_URL)

    const paymasterConfigs = [
      getAlchemyPaymasterConfig({
        chain: sepolia,
        rpcUrl: envVars.ALCHEMY_RPC_URL_OP_SEPOLIA,
        policyId: envVars.ALCHEMY_GAS_MANAGER_POLICY_ID_OP_SEPOLIA,
      }),
      getAlchemyPaymasterConfig({
        chain: optimismSepolia,
        rpcUrl: envVars.ALCHEMY_RPC_URL_OP_SEPOLIA,
        policyId: envVars.ALCHEMY_GAS_MANAGER_POLICY_ID_OP_SEPOLIA,
      }),
    ] as const satisfies PaymasterConfig[]

    const apiServer = await initializeApiServer(redisClient, paymasterConfigs)

    return new ProxyService(apiServer)
  }

  async run() {
    this.apiServer.listen(envVars.PORT, HOST, () => {
      console.log(`API server listening at http://${HOST}:${envVars.PORT}`)
    })
  }
}
