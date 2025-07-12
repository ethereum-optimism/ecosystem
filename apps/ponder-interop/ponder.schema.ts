// Hack to resolve https://github.com/ponder-sh/ponder/issues/1722
import 'drizzle-orm/pg-core'

import { index, onchainTable, primaryKey } from 'ponder'

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
    destinationTargetCompositeIdx: index().on(table.destination, table.target),
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

export const gasTankGasProviders = onchainTable(
  'gas_tank_gas_providers',
  (t) => ({
    chainId: t.bigint().notNull(),
    address: t.hex().notNull(),
    balance: t.bigint().notNull(),
    lastUpdatedAt: t.bigint().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.address] }),
  }),
)

export const gasTankPendingWithdrawals = onchainTable(
  'gas_tank_pending_withdrawals',
  (t) => ({
    chainId: t.bigint().notNull(),
    address: t.hex().notNull(),
    amount: t.bigint().notNull(),
    initiatedAt: t.bigint().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.chainId, table.address] }),
  }),
)

export const gasTankAuthorizedMessages = onchainTable(
  'gas_tank_authorized_messages',
  (t) => ({
    chainId: t.bigint().notNull(),
    gasProvider: t.hex().notNull(),
    messageHash: t.hex().notNull(),
    authorizedAt: t.bigint().notNull(),
  }),
  (table) => ({
    pk: primaryKey({
      columns: [table.chainId, table.gasProvider, table.messageHash],
    }),
  }),
)

export const gasTankClaimedMessages = onchainTable(
  'gas_tank_claimed_messages',
  (t) => ({
    messageHash: t.hex().notNull(),
    chainId: t.bigint().notNull(),
    relayer: t.hex().notNull(),
    claimer: t.hex().notNull(),
    gasProvider: t.hex().notNull(),
    claimCost: t.bigint().notNull(),
    relayCost: t.bigint().notNull(),
    claimedAt: t.bigint().notNull(),
  }),
  (table) => ({
    pk: primaryKey({
      columns: [table.chainId, table.messageHash],
    }),
  }),
)

export const gasTankRelayedMessageReceipts = onchainTable(
  'gas_tank_relayed_message_receipts',
  (t) => ({
    // unique identifier
    messageHash: t.hex().notNull().primaryKey(),

    // message fields
    origin: t.hex().notNull(),
    blockNumber: t.bigint().notNull(),
    logIndex: t.bigint().notNull(),
    timestamp: t.bigint().notNull(),
    chainId: t.bigint().notNull(),
    logPayload: t.hex().notNull(),

    // receipt fields
    gasProvider: t.hex().notNull(),
    gasProviderChainId: t.bigint().notNull(),
    relayer: t.hex().notNull(),
    relayCost: t.bigint().notNull(),
    nestedMessageHashes: t.hex().array().notNull(),
    relayedAt: t.bigint().notNull(),
  }),
  (table) => ({
    relayerIdx: index().on(table.relayer),
  }),
)
