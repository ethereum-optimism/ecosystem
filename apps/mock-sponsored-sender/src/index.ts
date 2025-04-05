import { serve } from '@hono/node-server'

import { createApiRouter } from '@/api.js'
import { parseClientConfig } from '@/config/config.js'
import type { JsonRpcHandler } from '@/jsonrpc/handler.js'
import { senderJsonRpcHandler } from '@/sender/senderJsonRpcHandler.js'

// create the sponsored senders
const { sender, clients } = await parseClientConfig()
const handlers: Record<number, JsonRpcHandler> = {}
for (const [chainId, client] of Object.entries(clients)) {
  handlers[Number(chainId)] = senderJsonRpcHandler(sender, client)
}

// serve the api
const api = createApiRouter(handlers)
serve(api, (info) => {
  console.log(`Listening on http://localhost:${info.port}`)
})
