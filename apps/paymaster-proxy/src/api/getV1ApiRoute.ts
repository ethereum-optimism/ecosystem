import type { Router } from 'express'
import express from 'express'
import type { Logger } from 'pino'

import { jsonRpcRequestParseErrorHandler } from '@/middlewares/jsonRpcRequestParseErrorHandler'
import type { Metrics } from '@/monitoring/metrics'
import type { PaymasterConfig } from '@/paymaster/types'
import { getJsonRpcRequestHandler } from '@/rpc/getJsonRpcRequestHandler'

export const V1_API_BASE_PATH = '/v1'

export const getV1ApiRoute = ({
  paymasterConfigs,
  metrics,
  logger,
}: {
  paymasterConfigs: PaymasterConfig[]
  metrics: Metrics
  logger: Logger
}): Router => {
  const route = express.Router()

  for (const { chain, sponsorUserOperation } of paymasterConfigs) {
    const path = `/${chain.id}/rpc`

    logger.info(
      `Registering paymaster RPC route at ${V1_API_BASE_PATH}${path}: ${chain.name}`,
    )

    route.use(path, express.json())
    route.post(
      path,
      getJsonRpcRequestHandler({
        sponsorUserOperation,
        logger: logger.child({ chainId: chain.id }),
        metrics,
        defaultMetricLabels: { apiVersion: 'v1', chainId: chain.id },
      }),
    )
    route.use(path, jsonRpcRequestParseErrorHandler)
  }

  return route
}
