import { serve } from '@hono/node-server'
import { pino } from 'pino'

import { createApiRouter } from '@/api.js'
import { parseClientConfig } from '@/config/config.js'
import type { JsonRpcHandler } from '@/jsonrpc/handler.js'
import { senderJsonRpcHandler } from '@/sender/senderJsonRpcHandler.js'

export const log = pino({
  level: process.env.LOG_LEVEL || 'debug',
  transport: {
    // TODO: adjust target pased on dev/prod
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: true,
      ignore: 'pid,hostname',
    },
  },
})

// create the sponsored senders
const { sender, clients } = await parseClientConfig()
log.debug(`configured sender ${sender.address}`)

// create json-rpc handlers for each endpoint
const handlers: Record<number, JsonRpcHandler> = {}
for (const [chainId, client] of Object.entries(clients)) {
  log.debug(`configured chain ${chainId}`)
  handlers[Number(chainId)] = senderJsonRpcHandler(sender, client)
}

// serve the api
const api = createApiRouter(log, handlers)
serve(api, (info) => {
  log.info(`started listening server on ${info.address}:${info.port}`)
})
