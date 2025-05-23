// Hack to resolve https://github.com/ponder-sh/ponder/issues/1722
import 'drizzle-orm/pg-core'

import { index, onchainTable } from 'ponder'

export const sentMessages = onchainTable(
  'l2_to_l2_cdm_sent_messages',
  (t) => ({
    // unique identifier
    messageIdentifierHash: t.hex().primaryKey(),

    // parsed message fields
    messageHash: t.hex().notNull(),
    source: t.bigint().notNull(),
    destination: t.bigint().notNull(),
    nonce: t.bigint().notNull(),
    sender: t.hex().notNull(),
    target: t.hex().notNull(),
    message: t.hex().notNull(),

    // log fields
    logIndex: t.bigint().notNull(),
    logPayload: t.hex().notNull(),

    // general fields
    timestamp: t.bigint().notNull(),
    blockNumber: t.bigint().notNull(),
    transactionHash: t.hex().notNull(),
    txOrigin: t.hex().notNull(),
  }),
  (table) => ({
    messageHashIdx: index().on(table.messageHash),
  }),
)

export const relayedMessages = onchainTable(
  'l2_to_l2_cdm_relayed_messages',
  (t) => ({
    // unique identifier
    messageHash: t.hex().primaryKey(),

    // Some unique metadata on the relaying side
    relayer: t.hex().notNull(),

    // log fields
    logIndex: t.bigint().notNull(),
    logPayload: t.hex().notNull(),

    // general fields
    timestamp: t.bigint().notNull(),
    blockNumber: t.bigint().notNull(),
    transactionHash: t.hex().notNull(),
  }),
)
