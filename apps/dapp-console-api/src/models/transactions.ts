import { type InferInsertModel, type InferSelectModel } from 'drizzle-orm'
import { relations } from 'drizzle-orm'
import {
  index,
  integer,
  numeric,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import type {
  Address,
  Hash,
  Transaction as ViemTransaction,
  TransactionReceipt,
} from 'viem'

import type { Database } from '@/db'

import { contracts } from './contracts'
import { entities } from './entities'
import { bigIntToNumeric, UINT256_PRECISION } from './utils'

export enum TransactionEvent {
  CONTRACT_DEPLOYMENT = 'contract_deployment',
}

export const transactions = pgTable(
  'transactions',
  {
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    id: uuid('id').defaultRandom().primaryKey(),
    entityId: uuid('entity_id')
      .references(() => entities.id)
      .notNull(),
    /** The contract associated with the transaction */
    contractId: uuid('contract_id').references(() => contracts.id),
    /** Id of chain that transaction took place on */
    chainId: integer('chain_id').notNull(),
    /** Hash of this transaction */
    transactionHash: varchar('transaction_hash').$type<Hash>().notNull(),
    /** Number of block containing this transaction */
    blockNumber: numeric('block_number', {
      precision: UINT256_PRECISION,
      scale: 0,
    }).notNull(),
    /** Transaction sender */
    fromAddress: varchar('from_address').$type<Address>().notNull(),
    /** Transaction recipient or `null` if deploying a contract */
    toAddress: varchar('to_address').$type<Address>(),
    /** Address of new contract or `null` if no contract was created */
    contractAddress: varchar('contract_address').$type<Address>(),
    /** Gas used by this transaction */
    gasUsed: numeric('gas_used', {
      precision: UINT256_PRECISION,
      scale: 0,
    }).notNull(),
    /** Equal to the actual gas price paid for inclusion. */
    gasPrice: numeric('gas_price', {
      precision: UINT256_PRECISION,
      scale: 0,
    }).notNull(),
    /** The actual value per gas deducted from the sender's account for blob gas. Only specified for blob transactions as defined by EIP-4844. */
    blobGasPrice: numeric('blob_gas_price', {
      precision: UINT256_PRECISION,
      scale: 0,
    }),
    /** The amount of blob gas used. Only specified for blob transactions as defined by EIP-4844. */
    blobGasUsed: numeric('blob_gas_used', {
      precision: UINT256_PRECISION,
      scale: 0,
    }),
    /** Transaction type */
    transactionType: varchar('transaction_type').notNull(),
    /** Used for tracking the kind of transaction this was */
    transactionEvent: varchar('transaction_event').$type<TransactionEvent>(),
    /** The maximum total fee per gas the sender is willing to pay for blob gas (in wei). */
    maxFeePerBlobGas: numeric('max_fee_per_blob_gas', {
      precision: UINT256_PRECISION,
      scale: 0,
    }),
    /** Total fee per gas in wei (gasPrice/baseFeePerGas + maxPriorityFeePerGas). */
    maxFeePerGas: numeric('max_fee_per_gas', {
      precision: UINT256_PRECISION,
      scale: 0,
    }),
    /** Max priority fee per gas (in wei). */
    maxPriorityFeePerGas: numeric('max_priority_fee_per_gas', {
      precision: UINT256_PRECISION,
      scale: 0,
    }),
    /** Value in wei sent with this transaction */
    value: numeric('value', {
      precision: UINT256_PRECISION,
      scale: 0,
    }),
    /** `success` if this transaction was successful or `reverted` if it failed */
    status: varchar('status').$type<'success' | 'reverted'>().notNull(),
    /** Unix timestamp of when this block was collated */
    blockTimestamp: integer('block_timestamp').notNull(),
  },
  (table) => {
    return {
      entityIdIdx: index().on(table.entityId),
      contractIdIdx: index().on(table.contractId),
    }
  },
)

export const transactionsRelations = relations(transactions, ({ one }) => ({
  contract: one(contracts, {
    fields: [transactions.contractId],
    references: [contracts.id],
  }),
  entity: one(entities, {
    fields: [transactions.entityId],
    references: [entities.id],
  }),
}))

export type Transaction = InferSelectModel<typeof transactions>
export type InsertTransaction = InferInsertModel<typeof transactions>

export const insertTransaction = async (input: {
  db: Database
  transaction: InsertTransaction
}) => {
  const { db, transaction } = input

  const results = await db.insert(transactions).values(transaction).returning()

  return results[0]
}

export const viemContractDeploymentTransactionToDbTransaction = (input: {
  transactionReceipt: TransactionReceipt
  transaction: ViemTransaction
  entityId: Transaction['entityId']
  chainId: Transaction['chainId']
  contractId: Transaction['contractId']
  deploymentTimestamp: bigint
}): InsertTransaction => {
  const {
    entityId,
    chainId,
    contractId,
    transactionReceipt,
    transaction,
    deploymentTimestamp,
  } = input
  return {
    entityId,
    chainId,
    contractId,
    transactionHash: transactionReceipt.transactionHash,
    blockNumber: bigIntToNumeric(transactionReceipt.blockNumber),
    fromAddress: transactionReceipt.from,
    toAddress: transactionReceipt.to,
    contractAddress: transactionReceipt.contractAddress,
    gasUsed: bigIntToNumeric(transactionReceipt.gasUsed),
    gasPrice: bigIntToNumeric(transactionReceipt.effectiveGasPrice),
    blobGasPrice: bigIntToNumeric(transactionReceipt.blobGasPrice),
    blobGasUsed: bigIntToNumeric(transactionReceipt.blobGasUsed),
    transactionType: transactionReceipt.type,
    transactionEvent: TransactionEvent.CONTRACT_DEPLOYMENT,
    maxFeePerBlobGas: bigIntToNumeric(transaction.maxFeePerBlobGas),
    maxPriorityFeePerGas: bigIntToNumeric(transaction.maxPriorityFeePerGas),
    value: bigIntToNumeric(transaction.value),
    status: transactionReceipt.status,
    blockTimestamp: Number(deploymentTimestamp),
  }
}
