import { Hono } from 'hono'
import { and, count, eq, inArray, isNull, replaceBigInts } from 'ponder'
import { db, publicClients } from 'ponder:api'
import schema from 'ponder:schema'
import { isAddress } from 'viem'

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

const chainIds = chains.map((c) => BigInt(c.id))

// List of interoperable chain
app.get('/chains', async (c) => {
  return c.json(chains)
})

// Count of all messages (sent, relayed, pending)
app.get('/messages/count', async (c) => {
  const sent = await db
    .select({ count: count() })
    .from(schema.sentMessages)
    .where(inArray(schema.sentMessages.destination, chainIds))

  const relayed = await db
    .select({ count: count() })
    .from(schema.relayedMessages)

  let pending = undefined
  if (sent.length > 0 && sent.length === relayed.length) {
    pending = sent[0]!.count - relayed[0]!.count
  }

  return c.json({ sent, relayed, pending })
})

// List of pending messages
app.get('/messages/pending', async (c) => {
  const result = await db
    .select()
    .from(schema.sentMessages)
    .limit(LIMIT)
    .leftJoin(
      schema.relayedMessages,
      eq(schema.sentMessages.messageHash, schema.relayedMessages.messageHash),
    )
    .where(isNull(schema.relayedMessages.messageHash))

  const messages = result
    .map((m) => m.l2_to_l2_cdm_sent_messages)
    .map((m) => replaceBigInts(m, (x) => Number(x)))

  return c.json(messages)
})

// List of pending messages for an account
app.get('/messages/:account/pending', async (c) => {
  const account = c.req.param('account').toLowerCase()
  if (!account || !isAddress(account)) {
    return c.json({ error: 'Invalid account' }, 400)
  }

  const result = await db
    .select()
    .from(schema.sentMessages)
    .limit(LIMIT)
    .leftJoin(
      schema.relayedMessages,
      eq(schema.sentMessages.messageHash, schema.relayedMessages.messageHash),
    )
    .where(
      and(
        isNull(schema.relayedMessages.messageHash),
        eq(schema.sentMessages.sender, account),
      ),
    )

  const messages = result
    .map((m) => m.l2_to_l2_cdm_sent_messages)
    .map((m) => replaceBigInts(m, (x) => Number(x)))

  return c.json(messages)
})

export default app
