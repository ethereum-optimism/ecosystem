import type { Router } from 'express'
import express from 'express'

import { jsonRpcRequestParseErrorHandler } from '@/middlewares/jsonRpcRequestParseErrorHandler'
import type { PaymasterConfig } from '@/paymaster/types'
import { getJsonRpcRequestHandler } from '@/rpc/getJsonRpcRequestHandler'

export const V1_API_BASE_PATH = '/v1'

export const getV1ApiRoute = ({
  paymasterConfigs,
}: {
  paymasterConfigs: PaymasterConfig[]
}): Router => {
  const route = express.Router()

  for (const { chain, sponsorUserOperation } of paymasterConfigs) {
    const path = `/${chain.id}/rpc`

    console.info(
      `Registering paymaster RPC route at ${V1_API_BASE_PATH}${path}: ${chain.name}`,
    )

    route.use(path, express.json())
    route.post(path, getJsonRpcRequestHandler({ sponsorUserOperation }))
    route.use(path, jsonRpcRequestParseErrorHandler)
  }

  return route
}
