import {
  index,
  integer,
  numeric,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import type { Address, Hash } from 'viem'

import { contracts } from './contracts'
import { entities } from './entities'
import { UINT256_PRECISION } from './utils'

enum TransactionEvent {
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
    transactionType: varchar('transaction_type')
      .$type<'legacy' | 'eip2930' | 'eip1559' | 'eip4844'>()
      .notNull(),
    /** Used for tracking the kind of transaction this was */
    transactionEvent: varchar('transaction_event').$type<TransactionEvent>(),
    /** The maximum total fee per gas the sender is willing to pay for blob gas (in wei). */
    maxFeePerBlobGas: numeric('max_fee_per_blob_gas', {
      precision: UINT256_PRECISION,
      scale: 0,
    }),
    /** Total fee per gas in wei (gasPrice/baseFeePerGas + maxPriorityFeePerGas). */
    maxFeePerGas: numeric('max_fee_per_blob_gas', {
      precision: UINT256_PRECISION,
      scale: 0,
    }),
    /** Max priority fee per gas (in wei). */
    maxPriorityFeePerGas: numeric('max_fee_per_blob_gas', {
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
      chainIdTransactionHashIdx: uniqueIndex().on(
        table.chainId,
        table.transactionHash,
      ),
      fromAddressIdx: index().on(table.fromAddress),
      toAddressIdx: index().on(table.toAddress),
      contractAddressIdx: index().on(table.contractAddress),
      entityBlockTimestampIdx: index().on(table.entityId, table.blockTimestamp),
    }
  },
)
