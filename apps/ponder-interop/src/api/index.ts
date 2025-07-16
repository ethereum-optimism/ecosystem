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
  ne,
  notInArray,
  or,
  replaceBigInts,
  sum,
} from 'ponder'
import { db, publicClients } from 'ponder:api'
import schema from 'ponder:schema'
import type { Address } from 'viem'
import { isAddress } from 'viem'

type GasProvider = {
  gasTankChainId: bigint
  gasProviderBalance: bigint
  gasProviderAddress: string
  pendingWithdrawal?: {
    amount: bigint
    initiatedAt: bigint
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

/**
 * List of pending messages
 * @param filteredTargets - Optional. Only messages that match these targets will be included in the query.
 * If not provided, all pending messages will be returned. Param is in the format Array<{address: <address>, chainId: <chainId>}>.
 * @returns The messages that have not been relayed yet.
 */
app.get('/messages/pending', async (c) => {
  const [filteredTargets, error] = c.req.query('filteredTargets')
    ? parseChainAddressPairs(c.req.query('filteredTargets'))
    : [[], null]

  if (error) {
    return c.json({ error }, 400)
  }

  const filteredTargetsByChain = getChainAddressPairsByChain(filteredTargets)

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
        or(
          ...Object.entries(filteredTargetsByChain).map(
            ([chainId, addresses]) =>
              and(
                eq(schema.sentMessages.destination, BigInt(chainId)),
                inArray(schema.sentMessages.target, addresses),
              ),
          ),
        ),
      ),
    )
    .orderBy(desc(schema.sentMessages.timestamp))

  const messages = result
    .map((m) => m.l2_to_l2_cdm_sent_messages)
    .map((m) => replaceBigInts(m, (x) => String(x)))

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
    .map((m) => replaceBigInts(m, (x) => String(x)))

  return c.json(messages)
})

/**
 * Fetches pending messages that have been authorized and have funds
 * @param excludedTargets - Any messages that match these targets will be excluded from the query.
 * Param is in the format Array<{address: <address>, chainId: <chainId>}>
 * @returns The pending messages
 */
app.get('/messages/pending/gas-tank', async (c) => {
  const [excludedTargets, error] = c.req.query('excludedTargets')
    ? parseChainAddressPairs(c.req.query('excludedTargets'))
    : [[], null]

  if (error) {
    return c.json({ error }, 400)
  }
  const result = await getPendingGasTankMessagesQuery(excludedTargets)

  // Group by messageIdentifierHash
  const groupedMessages = result.reduce(
    (acc, m) => {
      const messageId = m.message.messageIdentifierHash
      const gasTankInfo = {
        gasTankChainId: m.gasTankChainId,
        gasProviderBalance: m.gasProviderBalance,
        gasProviderAddress: m.gasProviderAddress,
        pendingWithdrawal: m.pendingWithdrawal
          ? {
              amount: m.pendingWithdrawal?.amount,
              initiatedAt: m.pendingWithdrawal?.initiatedAt,
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

  return c.json(messages.map((m) => replaceBigInts(m, (x) => String(x))))
})

app.get('/messages/pending/claims', async (c) => {
  const [relayers, error] = extractRelayers(c.req.query('relayers'))

  if (error) {
    return c.json({ error }, 400)
  }

  const result = await getPendingClaimsQuery(relayers)

  return c.json(result.map((m) => replaceBigInts(m, (x) => String(x))))
})

/**
 * Fetches pending claims for a given gas provider
 * @param gasProvider - The gas provider address
 * @param chainId - The chain ID to fetch pending claims for
 * @param relayers - The relayers to fetch pending claims for
 * @returns The pending claims
 */
app.get('/messages/pending/claims/:gasProvider/:chainId', async (c) => {
  const gasProvider = c.req.param('gasProvider').toLowerCase()
  if (!gasProvider || !isAddress(gasProvider)) {
    return c.json({ error: 'Invalid gas provider' }, 400)
  }

  const gasProviderChainId = parseChainId(c.req.param('chainId'))
  if (!gasProviderChainId) {
    return c.json({ error: 'Invalid chain id' }, 400)
  }

  const result = await getPendingClaimsForGasProviderQuery(
    gasProvider,
    gasProviderChainId,
  )

  if (result.length === 0) {
    return c.json(null)
  }

  if (result.length > 1) {
    return c.json({ error: 'Multiple gas providers found' }, 500)
  }

  return c.json(replaceBigInts(result[0], (x) => String(x)))
})

function parseChainId(chainIdParam: string): bigint | null {
  try {
    return BigInt(chainIdParam)
  } catch (error) {
    return null
  }
}

function getPendingClaimsQuery(relayers: Address[]) {
  return db
    .select({
      relayReceipt: schema.gasTankRelayedMessageReceipts,
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
    .innerJoin(
      schema.gasTankAuthorizedMessages,
      and(
        eq(
          schema.gasTankRelayedMessageReceipts.messageHash,
          schema.gasTankAuthorizedMessages.messageHash,
        ),
        eq(
          schema.gasTankRelayedMessageReceipts.gasProvider,
          schema.gasTankAuthorizedMessages.gasProvider,
        ),
        eq(
          schema.gasTankRelayedMessageReceipts.gasProviderChainId,
          schema.gasTankAuthorizedMessages.chainId,
        ),
      ),
    )
    .where(
      and(
        isNull(schema.gasTankClaimedMessages.messageHash),
        inArray(schema.gasTankRelayedMessageReceipts.relayer, relayers),
      ),
    )
    .orderBy(desc(schema.gasTankRelayedMessageReceipts.relayedAt))
}

/**
 * Fetches pending claims for a given gas provider
 * @param gasProvider - The gas provider address
 * @param gasProviderChainId - The chain ID of the gas provider
 * @returns The pending claims
 */
function getPendingClaimsForGasProviderQuery(
  gasProvider: Address,
  gasProviderChainId: bigint,
) {
  return db
    .select({
      gasProviderAddress: schema.gasTankGasProviders.address,
      gasProviderChainId: schema.gasTankGasProviders.chainId,
      totalPendingRelayCost: sum(
        schema.gasTankRelayedMessageReceipts.relayCost,
      ),
      pendingReceiptsCount: count(
        schema.gasTankRelayedMessageReceipts.messageHash,
      ),
    })
    .from(schema.gasTankRelayedMessageReceipts)
    .leftJoin(
      schema.gasTankClaimedMessages,
      eq(
        schema.gasTankRelayedMessageReceipts.messageHash,
        schema.gasTankClaimedMessages.messageHash,
      ),
    )
    .innerJoin(
      schema.gasTankAuthorizedMessages,
      and(
        eq(
          schema.gasTankRelayedMessageReceipts.messageHash,
          schema.gasTankAuthorizedMessages.messageHash,
        ),
        eq(
          schema.gasTankRelayedMessageReceipts.gasProvider,
          schema.gasTankAuthorizedMessages.gasProvider,
        ),
        eq(
          schema.gasTankRelayedMessageReceipts.gasProviderChainId,
          schema.gasTankAuthorizedMessages.chainId,
        ),
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
    .where(
      and(
        isNull(schema.gasTankClaimedMessages.messageHash),
        eq(schema.gasTankGasProviders.address, gasProvider),
        eq(schema.gasTankGasProviders.chainId, gasProviderChainId),
      ),
    )
    .groupBy(
      schema.gasTankGasProviders.address,
      schema.gasTankGasProviders.chainId,
    )
}

/**
 * Fetches pending messages that have been authorized and have funds
 * @param excludedTargets - Any messages that match these targets will be excluded from the query
 * @returns The pending messages
 */
function getPendingGasTankMessagesQuery(
  excludedTargets: Array<{ address: Address; chainId: bigint }>,
) {
  const excludedTargetsByChain = getChainAddressPairsByChain(excludedTargets)

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
    .where(
      and(
        isNull(schema.relayedMessages.messageHash),
        ...Object.entries(excludedTargetsByChain).map(([chainId, addresses]) =>
          or(
            ne(schema.sentMessages.destination, BigInt(chainId)),
            notInArray(schema.sentMessages.target, addresses),
          ),
        ),
      ),
    )
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

/**
 * Extracts and validates relayers from query parameter
 * @param relayersParam - The raw relayers query parameter
 * @returns Tuple of [relayers, error] where error is null if successful
 */
function extractRelayers(
  relayersParam: string | undefined,
): [Address[], string | null] {
  if (!relayersParam) {
    return [[], 'No relayers provided']
  }

  const relayers: Address[] = []
  try {
    for (const relayer of JSON.parse(relayersParam)) {
      if (!isAddress(relayer)) {
        return [[], 'Invalid relayer']
      }
      relayers.push(relayer.toLowerCase() as Address)
    }
  } catch (error) {
    return [[], 'Invalid relayers parameter format']
  }

  return [relayers, null]
}

/**
 * Parses a JSON string of chainId/address pairs into an array of objects
 * @param chainAddressPairsParam - The raw chainAddressPairs query parameter in JSON string format of
 * Array<{address: <address>, chainId: <chainId>}>
 * @returns Tuple of [chainAddressPairs, error] where error is null if successful
 */
function parseChainAddressPairs(
  chainAddressPairsParam: string | undefined,
): [Array<{ address: Address; chainId: bigint }>, string | null] {
  if (!chainAddressPairsParam) {
    return [[], 'No chain address pairs provided']
  }

  const chainAddressPairs: Array<{ address: Address; chainId: bigint }> = []
  try {
    for (const chainAddressPair of JSON.parse(chainAddressPairsParam) as Array<{
      address: string
      chainId: string
    }>) {
      if (!isAddress(chainAddressPair.address)) {
        return [[], 'Invalid address']
      }
      if (!parseChainId(chainAddressPair.chainId)) {
        return [[], 'Invalid chain id']
      }
      chainAddressPairs.push({
        address: chainAddressPair.address.toLowerCase() as Address,
        chainId: parseChainId(chainAddressPair.chainId)!,
      })
    }
  } catch (error) {
    return [[], 'Invalid chain address pairs parameter format']
  }

  return [chainAddressPairs, null]
}

/**
 * Groups chainAddressPairs by chainId
 * @param chainAddressPairs - The chainAddressPairs to group
 * @returns A record of chainId to addresses
 */
function getChainAddressPairsByChain(
  chainAddressPairs: Array<{ address: Address; chainId: bigint }>,
): Record<string, Address[]> {
  return chainAddressPairs.reduce((acc, chainAddressPair) => {
    if (!acc[`${chainAddressPair.chainId}`]) {
      acc[`${chainAddressPair.chainId}`] = []
    }
    acc[`${chainAddressPair.chainId}`]!.push(chainAddressPair.address)
    return acc
  }, {} as Record<string, Address[]>)
}

export default app
