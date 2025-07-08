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
  max,
  replaceBigInts,
} from 'ponder'
import { db, publicClients } from 'ponder:api'
import schema from 'ponder:schema'
import type { Address } from 'viem'
import { getAddress, isAddress } from 'viem'

type GasProvider = {
  gasTankChainId: number
  gasProviderBalance: number
  gasProviderAddress: string
  pendingWithdrawal?: {
    amount: number
    initiatedAt: number
  }
}

// TODO: Pagination & Limits
const MESSAGE_LIMIT = 10
const CLAIM_LIMIT = 10
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
    .limit(MESSAGE_LIMIT)
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
    .limit(MESSAGE_LIMIT)
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
  const result = await getPendingGasTankMessagesQuery()

  // Group by messageIdentifierHash
  const groupedMessages = result.reduce(
    (acc, m) => {
      const messageId = m.message.messageIdentifierHash
      const gasTankInfo = {
        gasTankChainId: Number(m.gasTankChainId),
        gasProviderBalance: Number(m.gasProviderBalance),
        gasProviderAddress: m.gasProviderAddress,
        pendingWithdrawal: m.pendingWithdrawal
          ? {
              amount: Number(m.pendingWithdrawal?.amount),
              initiatedAt: Number(m.pendingWithdrawal?.initiatedAt),
            }
          : undefined,
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

app.get('/messages/pending/claims', async (c) => {
  const relayersParam = c.req.query('relayers')

  if (!relayersParam) {
    return c.json({ error: 'No relayers provided' }, 400)
  }

  const relayers: Address[] = []
  try {
    for (const relayer of JSON.parse(relayersParam)) {
      if (!isAddress(relayer, { strict: false })) {
        return c.json({ error: 'Invalid relayer' }, 400)
      }
      relayers.push(getAddress(relayer))
    }
  } catch (error) {
    return c.json({ error: 'Invalid relayers parameter format' }, 400)
  }

  const result = await getPendingClaimsQuery(relayers)

  // Group by messageHash
  const groupedMessages = result.reduce(
    (acc, m) => {
      const messageId = m.messageReceipt.messageHash
      const gasTankInfo = {
        gasTankChainId: Number(m.gasTankChainId),
        gasProviderBalance: Number(m.gasProviderBalance),
        gasProviderAddress: m.gasProviderAddress,
        pendingWithdrawal: m.pendingWithdrawal
          ? {
              amount: Number(m.pendingWithdrawal?.amount),
              initiatedAt: Number(m.pendingWithdrawal?.initiatedAt),
            }
          : undefined,
      }

      if (!acc[messageId]) {
        acc[messageId] = {
          relayReceipt: m.messageReceipt,
          gasTankProviders: [],
        }
      }

      acc[messageId]!.gasTankProviders.push(gasTankInfo)
      return acc
    },
    {} as Record<
      string,
      {
        relayReceipt: InferSelectModel<
          typeof schema.gasTankRelayedMessageReceipts
        >
      } & {
        gasTankProviders: GasProvider[]
      }
    >,
  )

  const messages = Object.values(groupedMessages)

  return c.json(messages.map((m) => replaceBigInts(m, (x) => Number(x))))
})

function getPendingClaimsQuery(relayers: Address[]) {
  const mostRecentPendingMessageReceiptsQuery = db
    .select({
      messageHash: schema.gasTankRelayedMessageReceipts.messageHash,
    })
    .from(schema.gasTankRelayedMessageReceipts)
    .limit(CLAIM_LIMIT)
    .leftJoin(
      schema.gasTankClaimedMessages,
      eq(
        schema.gasTankRelayedMessageReceipts.messageHash,
        schema.gasTankClaimedMessages.messageHash,
      ),
    )
    .where(
      and(
        isNull(schema.gasTankClaimedMessages.messageHash),
        inArray(schema.gasTankRelayedMessageReceipts.relayer, relayers),
      ),
    )
    .orderBy(desc(schema.gasTankRelayedMessageReceipts.relayedAt))
    .as('mostRecentPendingMessageReceiptsQuery')

  return db
    .select({
      messageReceipt: schema.gasTankRelayedMessageReceipts,
      pendingWithdrawal: schema.gasTankPendingWithdrawals,
      gasTankChainId: schema.gasTankGasProviders.chainId,
      gasProviderBalance: schema.gasTankGasProviders.balance,
      gasProviderAddress: schema.gasTankAuthorizedMessages.gasProvider,
    })
    .from(schema.gasTankRelayedMessageReceipts)
    .innerJoin(
      mostRecentPendingMessageReceiptsQuery,
      eq(
        schema.gasTankRelayedMessageReceipts.messageHash,
        mostRecentPendingMessageReceiptsQuery.messageHash,
      ),
    )
    .innerJoin(
      schema.gasTankAuthorizedMessages,
      eq(
        schema.gasTankRelayedMessageReceipts.messageHash,
        schema.gasTankAuthorizedMessages.messageHash,
      ),
    )
    .innerJoin(
      schema.gasTankGasProviders,
      and(
        eq(
          schema.gasTankAuthorizedMessages.gasProvider,
          schema.gasTankGasProviders.address,
        ),
        eq(
          schema.gasTankAuthorizedMessages.chainId,
          schema.gasTankGasProviders.chainId,
        ),
      ),
    )
    .leftJoin(
      schema.gasTankPendingWithdrawals,
      and(
        eq(
          schema.gasTankGasProviders.address,
          schema.gasTankPendingWithdrawals.address,
        ),
        eq(
          schema.gasTankGasProviders.chainId,
          schema.gasTankPendingWithdrawals.chainId,
        ),
      ),
    )
    .orderBy(desc(schema.gasTankRelayedMessageReceipts.relayedAt))
}

function getPendingGasTankMessagesQuery() {
  const distinctMessagesAndMaxTimestampQuery = db
    .select({
      messageHash: schema.sentMessages.messageHash,
      // A messageHash can be sent multiple times, so we need to
      // get the latest timestamp for each messageHash in order
      // to get the latest message for each messageHash
      maxTimestamp: max(schema.sentMessages.timestamp).as('maxTimestamp'),
    })
    .from(schema.sentMessages)
    .groupBy(schema.sentMessages.messageHash)
    .limit(MESSAGE_LIMIT)
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
      and(
        eq(
          schema.gasTankAuthorizedMessages.gasProvider,
          schema.gasTankGasProviders.address,
        ),
        eq(
          schema.gasTankGasProviders.chainId,
          schema.gasTankAuthorizedMessages.chainId,
        ),
        gt(schema.gasTankGasProviders.balance, 0n),
      ),
    )
    .where(isNull(schema.relayedMessages.messageHash))
    .orderBy(desc(max(schema.sentMessages.timestamp)))
    .as('distinctMessagesAndMaxTimestampQuery')

  const distinctMessages = db
    .select({
      messageHash: schema.sentMessages.messageHash,
      timestamp: max(schema.sentMessages.timestamp).as('maxTimestamp'),
      // technically a message could be sent and resent in the same block
      // so we get the latest logIndex for each messageHash in order
      // to get the latest message emitted for each messageHash.
      logIndex: max(schema.sentMessages.logIndex).as('maxLogIndex'),
    })
    .from(schema.sentMessages)
    .groupBy(schema.sentMessages.messageHash)
    .innerJoin(
      distinctMessagesAndMaxTimestampQuery,
      and(
        eq(
          schema.sentMessages.messageHash,
          distinctMessagesAndMaxTimestampQuery.messageHash,
        ),
        eq(
          schema.sentMessages.timestamp,
          distinctMessagesAndMaxTimestampQuery.maxTimestamp,
        ),
      ),
    )
    .as('distinctMessages')

  return db
    .select({
      message: schema.sentMessages,
      pendingWithdrawal: schema.gasTankPendingWithdrawals,
      gasTankChainId: schema.gasTankGasProviders.chainId,
      gasProviderBalance: schema.gasTankGasProviders.balance,
      gasProviderAddress: schema.gasTankAuthorizedMessages.gasProvider,
    })
    .from(schema.sentMessages)
    .innerJoin(
      distinctMessages,
      and(
        eq(schema.sentMessages.messageHash, distinctMessages.messageHash),
        eq(schema.sentMessages.timestamp, distinctMessages.timestamp),
        eq(schema.sentMessages.logIndex, distinctMessages.logIndex),
      ),
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
      and(
        eq(
          schema.gasTankAuthorizedMessages.gasProvider,
          schema.gasTankGasProviders.address,
        ),
        eq(
          schema.gasTankGasProviders.chainId,
          schema.gasTankAuthorizedMessages.chainId,
        ),
        gt(schema.gasTankGasProviders.balance, 0n),
      ),
    )
    .leftJoin(
      schema.gasTankPendingWithdrawals,
      and(
        eq(
          schema.gasTankGasProviders.address,
          schema.gasTankPendingWithdrawals.address,
        ),
        eq(
          schema.gasTankGasProviders.chainId,
          schema.gasTankPendingWithdrawals.chainId,
        ),
      ),
    )
    .orderBy(desc(schema.sentMessages.timestamp))
}

export default app
