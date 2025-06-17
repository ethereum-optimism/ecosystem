import type { InferSelectModel } from 'drizzle-orm'
import { Hono } from 'hono'
import {
  and,
  count,
  desc,
  eq,
  gt,
  inArray,
  isNull,
  replaceBigInts,
} from 'ponder'
import { db, publicClients } from 'ponder:api'
import schema from 'ponder:schema'
import { isAddress } from 'viem'

type GasProvider = {
  gasTankChainId: number
  gasProviderBalance: number
  gasProviderAddress: string
}

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

app.get('/schema', async (c) => {
  return c.json(process.env.DATABASE_SCHEMA)
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
    .orderBy(desc(schema.sentMessages.timestamp))

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
    .orderBy(desc(schema.sentMessages.timestamp))

  const messages = result
    .map((m) => m.l2_to_l2_cdm_sent_messages)
    .map((m) => replaceBigInts(m, (x) => Number(x)))

  return c.json(messages)
})

// List of pending messages that have been authorized and have funds
app.get('/messages/pending/gas-tank', async (c) => {
  const result = await getPendingMessagesQuery()

  // Group by messageIdentifierHash
  const groupedMessages = result.reduce(
    (acc, m) => {
      const messageId = m.message.messageIdentifierHash
      const gasTankInfo = {
        gasTankChainId: Number(m.gasTankChainId),
        gasProviderBalance: Number(m.gasProviderBalance),
        gasProviderAddress: m.gasProviderAddress,
      }

      if (!acc[messageId]) {
        acc[messageId] = {
          ...m.message,
          gasTankProviders: [],
        }
      }

      acc[messageId]!.gasTankProviders.push(gasTankInfo)
      return acc
    },
    {} as Record<
      string,
      InferSelectModel<typeof schema.sentMessages> & {
        gasTankProviders: GasProvider[]
      }
    >,
  )

  const messages = Object.values(groupedMessages)

  return c.json(messages.map((m) => replaceBigInts(m, (x) => Number(x))))
})

export default app

function getPendingMessagesQuery() {
  return db
    .select({
      message: schema.sentMessages,
      gasTankChainId: schema.gasTankGasProviders.chainId,
      gasProviderBalance: schema.gasTankGasProviders.balance,
      gasProviderAddress: schema.gasTankAuthorizedMessages.gasProvider,
    })
    .from(schema.sentMessages)
    .limit(LIMIT)
    .leftJoin(
      schema.relayedMessages,
      eq(schema.sentMessages.messageHash, schema.relayedMessages.messageHash),
    )
    .innerJoin(
      schema.gasTankAuthorizedMessages,
      eq(
        schema.sentMessages.messageHash,
        schema.gasTankAuthorizedMessages.messageHash,
      ),
    )
    .innerJoin(
      schema.gasTankGasProviders,
      eq(
        schema.gasTankAuthorizedMessages.gasProvider,
        schema.gasTankGasProviders.address,
      ),
    )
    .where(
      and(
        isNull(schema.relayedMessages.messageHash),
        eq(
          schema.gasTankAuthorizedMessages.chainId,
          schema.gasTankGasProviders.chainId,
        ),
        gt(schema.gasTankGasProviders.balance, 0n),
      ),
    )
    .orderBy(desc(schema.sentMessages.timestamp))
}
