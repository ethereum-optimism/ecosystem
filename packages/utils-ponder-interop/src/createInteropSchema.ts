// hack to get type inference for drizzle-orm/pg-core working
import type {} from 'drizzle-orm/pg-core'
import { onchainTable } from 'ponder'

export interface InteropSchemaOptions {
  tableName?: {
    sentMessages?: string
    relayedMessages?: string
  }
  // other customization options
}

export function createInteropSchema(options?: InteropSchemaOptions) {
  const tableNames = {
    sentMessages:
      options?.tableName?.sentMessages ?? 'l2_to_l2_cdm_sent_messages',
    relayedMessages:
      options?.tableName?.relayedMessages ?? 'l2_to_l2_cdm_relayed_messages',
  }

  return {
    sentMessages: onchainTable(tableNames.sentMessages, (t) => ({
      // unique identifier
      messageHash: t.hex().primaryKey(),

      // parsed message fields
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
    })),
    relayedMessages: onchainTable(tableNames.relayedMessages, (t) => ({
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
    })),
  }
}
