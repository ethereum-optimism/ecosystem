import { PonderApi } from '@eth-optimism/utils-ponder-interop'
import { Hono } from 'hono'
import { db, publicClients } from 'ponder:api'
import schema from 'ponder:schema'

// TODO: Pagination & Limits
const LIMIT = 10
const app = new Hono()

const chains = Object.values(publicClients).map((client) => {
  if (!client.chain) {
    throw new Error(`missing chain id in client ${client.name}`)
  }
  if (!client.transport.url) {
    throw new Error(`missing transport url in client ${client.name}`)
  }

  return {
    id: client.chain.id,
    name: client.chain.name,
    url: client.transport.url,
  }
})
new PonderApi(app, schema, chains, db, LIMIT)

export default app
