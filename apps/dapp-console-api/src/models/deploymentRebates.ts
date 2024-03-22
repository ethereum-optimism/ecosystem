import {
  bigint,
  index,
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import type { Address, Hash } from 'viem'

import { contracts } from './contracts'
import { entities } from './entities'

enum DeploymentRebateState {
  APPROVED = 'approved',
  PENDING_APPROVAL = 'pending_approval',
  REBATE_SENT = 'rebate_sent',
  REJECTED = 'rejected',
  NEEDS_CB_VERIFICATION = 'approved_but_needs_cb_verification',
}

enum RejectionReason {}

export const deploymentRebates = pgTable(
  'deploymentRebates',
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
    contractId: uuid('contract_id')
      .references(() => contracts.id)
      .notNull(),
    contractAddress: varchar('contract_address').$type<Address>().notNull(),
    chainId: integer('chain_id').notNull(),
    state: varchar('state')
      .$type<DeploymentRebateState>()
      .default(DeploymentRebateState.PENDING_APPROVAL)
      .notNull(),
    rejectionReason: varchar('rejection_reason').$type<RejectionReason>(),
    rebateTxHash: varchar('rebate_tx_hash').$type<Hash>(),
    rebateAmount: bigint('rebate_amount', { mode: 'bigint' }),
    recipientAddress: varchar('recipient_address').$type<Address>(),
  },
  (table) => {
    return {
      entityIdx: index().on(table.entityId),
      contractIdx: index().on(table.contractId),
      contractAddressChainIdIdx: index().on(
        table.contractAddress,
        table.chainId,
      ),
    }
  },
)
