import type { Router } from 'express'
import express from 'express'
import type { Logger } from 'pino'
import {
  baseSepolia,
  optimism,
  optimismSepolia,
  sepolia,
  zoraSepolia,
} from 'viem/chains'

import type { ApiKeyServiceClient } from '@/apiKeyService/createApiKeyServiceClient'
import type {
  MainnetChainConfig,
  TestnetChainConfig,
} from '@/config/ChainConfig'
import { chainConfigByChainId } from '@/config/chainConfigByChainId'
import { fraxtalSepolia } from '@/constants/fraxtalSepolia'
import type { Database } from '@/db/Database'
import { createExpressRouterFromJsonRpcRouter } from '@/jsonRpc/createExpressRouterFromJsonRpcRouter'
import type { Metrics } from '@/monitoring/metrics'
import { createMainnetJsonRpcRouterWithAlchemyPaymasterProvider } from '@/paymasterProvider/alchemy/createMainnetJsonRpcRouterWithAlchemyPaymasterProvider'
import { createTestnetJsonRpcRouterWithAlchemyPaymasterProvider } from '@/paymasterProvider/alchemy/createTestnetJsonRpcRouterWithAlchemyPaymasterProvider'

export const V1_API_BASE_PATH = '/v1'

export const createV1ApiRouter = ({
  metrics,
  logger,
  database,
  apiKeyServiceClient,
}: {
  metrics: Metrics
  logger: Logger
  database: Database
  apiKeyServiceClient: ApiKeyServiceClient
}): Router => {
  const router = express.Router()

  registerTestnetWithAlchemyPaymasterProvider(router, {
    chainConfig: chainConfigByChainId[sepolia.id],
    database,
    apiKeyServiceClient,
    metrics,
    logger,
  })

  registerTestnetWithAlchemyPaymasterProvider(router, {
    chainConfig: chainConfigByChainId[optimismSepolia.id],
    database,
    apiKeyServiceClient,
    metrics,
    logger,
  })

  registerTestnetWithAlchemyPaymasterProvider(router, {
    chainConfig: chainConfigByChainId[baseSepolia.id],
    database,
    apiKeyServiceClient,
    metrics,
    logger,
  })

  registerTestnetWithAlchemyPaymasterProvider(router, {
    chainConfig: chainConfigByChainId[zoraSepolia.id],
    database,
    apiKeyServiceClient,
    metrics,
    logger,
  })

  registerTestnetWithAlchemyPaymasterProvider(router, {
    chainConfig: chainConfigByChainId[fraxtalSepolia.id],
    database,
    apiKeyServiceClient,
    metrics,
    logger,
  })

  registerMainnetWithAlchemyPaymasterProvider(router, {
    chainConfig: chainConfigByChainId[optimism.id],
    database,
    apiKeyServiceClient,
    metrics,
    logger,
  })

  return router
}

const registerTestnetWithAlchemyPaymasterProvider = (
  router: express.Router,
  {
    chainConfig,
    database,
    apiKeyServiceClient,
    metrics,
    logger,
  }: {
    chainConfig: TestnetChainConfig
    database: Database
    apiKeyServiceClient: ApiKeyServiceClient
    metrics: Metrics
    logger: Logger
  },
) => {
  const { chain } = chainConfig
  const defaultMetricLabels = { apiVersion: 'v1', chainId: chain.id }

  const jsonRpcRouter = createTestnetJsonRpcRouterWithAlchemyPaymasterProvider({
    chainConfig,
    database,
    apiKeyServiceClient,
    metrics,
    defaultMetricLabels,
    logger,
  })

  const path = `/${chain.id}/rpc`

  logger.info(
    `Registering testnet paymaster RPC route at ${V1_API_BASE_PATH}${path}: ${chain.name}`,
  )

  router.use(path, createExpressRouterFromJsonRpcRouter(jsonRpcRouter))
}

const registerMainnetWithAlchemyPaymasterProvider = (
  router: express.Router,
  {
    chainConfig,
    database,
    apiKeyServiceClient,
    metrics,
    logger,
  }: {
    chainConfig: MainnetChainConfig
    database: Database
    apiKeyServiceClient: ApiKeyServiceClient
    metrics: Metrics
    logger: Logger
  },
) => {
  const { chain } = chainConfig

  const jsonRpcRouter = createMainnetJsonRpcRouterWithAlchemyPaymasterProvider({
    chainConfig,
    database,
    apiKeyServiceClient,
    metrics,
    defaultMetricLabels: { apiVersion: 'v1', chainId: chain.id },
    logger,
  })

  const path = `/${chain.id}/rpc`

  logger.info(
    `Registering mainnet paymaster RPC route at ${V1_API_BASE_PATH}${path}: ${chain.name}`,
  )

  router.use(path, createExpressRouterFromJsonRpcRouter(jsonRpcRouter))
}
