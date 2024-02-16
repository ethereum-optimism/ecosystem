import type { ErrorRequestHandler, Express } from 'express'
import express from 'express'
import type { Redis } from 'ioredis'

import { JsonRpcError } from '@/errors/JsonRpcError'
import { getRateLimiter } from '@/middlewares/getRateLimiter'
import type { PaymasterConfig } from '@/paymaster/types'
import { getJsonRpcRequestHandler } from '@/rpc/getJsonRpcRequestHandler'

export const initializeApiServer = async (
  redisClient: Redis,
  paymasterConfigs: PaymasterConfig[],
): Promise<Express> => {
  const app = express()

  app.use(getRateLimiter(redisClient))

  app.get('/healthz', (req, res) => {
    res.json({ ok: true })
  })

  app.get('/ready', (req, res) => {
    // TODO: add check for whether underlying services are ready
    res.json({ ok: true })
  })

  app.use(express.json(), ((err, req, res, next) => {
    if (err.status === 400 && err instanceof SyntaxError && 'body' in err) {
      // If JSON parsing fails, return a -32700 JSON-RPC error
      return res.json(JsonRpcError.parseError().response())
    }

    next(err)
  }) as ErrorRequestHandler)

  for (const { chain, sponsorUserOperation } of paymasterConfigs) {
    console.info(`Registering paymaster route at /${chain.id}: ${chain.name}`)

    app.post(`/${chain.id}`, getJsonRpcRequestHandler({ sponsorUserOperation }))
  }

  app.use((req, res) => {
    res.status(404)
  })

  return app
}
