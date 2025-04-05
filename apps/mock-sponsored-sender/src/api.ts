import { Hono } from 'hono'
import { z } from 'zod'

import type { JsonRpcHandler } from '@/jsonrpc/handler.js'
import type { JsonRpcResponse } from '@/jsonrpc/types.js'
import { parseRequestBody } from '@/jsonrpc/utils.js'

const sponsoredEndpointSchema = z.object({
  chainId: z.coerce.number().int().positive(),
})

/**
 * Create a Hono API Router that routes JSON RPC requests to the correct
 * handler based on the chain ID.
 * @param handlers - A map of chain IDs to JSON RPC handlers.
 * @returns A Hono API Router.
 */
export function createApiRouter(handlers: Record<number, JsonRpcHandler>) {
  const api = new Hono()

  // global middleware
  api.use(async (c, next) => {
    const { req } = c
    const now = Date.now()
    await next()
    const ms = Date.now() - now
    console.log(
      `[${new Date(now).toISOString()}] ${req.method} ${req.url} - ${ms}ms`,
    )
  })

  // route json rpc requests based on chainId
  api.post('/:chainId', async (c) => {
    if (c.req.header('Content-Type') !== 'application/json') {
      return c.json({ error: 'Content-Type must be application/json' }, 400)
    }

    const params = c.req.param()
    const result = sponsoredEndpointSchema.safeParse(params)
    if (!result.success) {
      return c.json({ error: result.error.format() }, 400)
    }

    const chainId = result.data.chainId
    const handler = chainId in handlers ? handlers[chainId] : null
    if (!handler) {
      return c.json({ error: 'unregistered chainId' }, 400)
    }

    const body = await c.req.json()
    const bodyResult = parseRequestBody(body)
    if (bodyResult.error) {
      const resp = {
        jsonrpc: '2.0',
        id: null,
        error: { code: -32600, message: 'Invalid request' },
      } satisfies JsonRpcResponse

      return c.json(resp)
    }

    const response = await handler.handle(bodyResult.data)
    return c.json(response)
  })

  return api
}
