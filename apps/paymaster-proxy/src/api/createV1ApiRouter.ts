import type { Router } from 'express'
import express from 'express'
import type { Logger } from 'pino'
import type { Chain } from 'viem'
import { baseSepolia, optimismSepolia, sepolia, zoraSepolia } from 'viem/chains'

import { fraxtalSepolia } from '@/constants/fraxtalSepolia'
import { envVars } from '@/envVars'
import { createExpressRouterFromJsonRpcRouter } from '@/jsonRpc/createExpressRouterFromJsonRpcRouter'
import type { Metrics } from '@/monitoring/metrics'
import { createTestnetJsonRpcRouterWithAlchemyPaymasterProvider } from '@/paymasterProvider/alchemy/createTestnetJsonRpcRouterWithAlchemyPaymasterProvider'

export const V1_API_BASE_PATH = '/v1'

const registerTestnetWithAlchemyPaymasterProvider = (
  router: express.Router,
  {
    chain,
    rpcUrl,
    sharedPolicyId,
    metrics,
    logger,
  }: {
    chain: Chain
    rpcUrl: string
    sharedPolicyId: string
    metrics: Metrics
    logger: Logger
  },
) => {
  const defaultMetricLabels = { apiVersion: 'v1', chainId: chain.id }

  const jsonRpcRouter = createTestnetJsonRpcRouterWithAlchemyPaymasterProvider({
    chain,
    rpcUrl,
    sharedPolicyId,
    metrics,
    defaultMetricLabels,
    logger,
  })

  const path = `/${chain.id}/rpc`

  logger.info(
    `Registering paymaster RPC route at ${V1_API_BASE_PATH}${path}: ${chain.name}`,
  )

  router.use(path, createExpressRouterFromJsonRpcRouter(jsonRpcRouter))
}

export const createV1ApiRouter = ({
  metrics,
  logger,
}: {
  metrics: Metrics
  logger: Logger
}): Router => {
  const router = express.Router()

  registerTestnetWithAlchemyPaymasterProvider(router, {
    chain: sepolia,
    rpcUrl: envVars.ALCHEMY_RPC_URL_SEPOLIA,
    sharedPolicyId: envVars.ALCHEMY_GAS_MANAGER_POLICY_ID_SEPOLIA,
    metrics,
    logger,
  })

  registerTestnetWithAlchemyPaymasterProvider(router, {
    chain: optimismSepolia,
    rpcUrl: envVars.ALCHEMY_RPC_URL_OP_SEPOLIA,
    sharedPolicyId: envVars.ALCHEMY_GAS_MANAGER_POLICY_ID_OP_SEPOLIA,
    metrics,
    logger,
  })

  registerTestnetWithAlchemyPaymasterProvider(router, {
    chain: baseSepolia,
    rpcUrl: envVars.ALCHEMY_RPC_URL_BASE_SEPOLIA,
    sharedPolicyId: envVars.ALCHEMY_GAS_MANAGER_POLICY_ID_BASE_SEPOLIA,
    metrics,
    logger,
  })

  registerTestnetWithAlchemyPaymasterProvider(router, {
    chain: zoraSepolia,
    rpcUrl: envVars.ALCHEMY_RPC_URL_ZORA_SEPOLIA,
    sharedPolicyId: envVars.ALCHEMY_GAS_MANAGER_POLICY_ID_ZORA_SEPOLIA,
    metrics,
    logger,
  })

  registerTestnetWithAlchemyPaymasterProvider(router, {
    chain: fraxtalSepolia,
    rpcUrl: envVars.ALCHEMY_RPC_URL_FRAXTAL_SEPOLIA,
    sharedPolicyId: envVars.ALCHEMY_GAS_MANAGER_POLICY_ID_FRAXTAL_SEPOLIA,
    metrics,
    logger,
  })

  return router
}
