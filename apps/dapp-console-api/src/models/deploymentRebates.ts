import { and, arrayContains, eq, relations, sql, sum } from 'drizzle-orm'
import {
  index,
  integer,
  numeric,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import type { Address, Hash } from 'viem'

import type { Database } from '@/db'

import { contracts } from './contracts'
import type { Entity } from './entities'
import { entities } from './entities'
import { UINT256_PRECISION } from './utils'
import { getWalletVerifications } from './wallets'

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
    rebateAmount: numeric('rebate_amount', {
      precision: UINT256_PRECISION,
      scale: 0,
    }),
    recipientAddress: varchar('recipient_address').$type<Address>(),
    /** The wallets used for verifying that the user is eligible for a rebate. */
    verifiedWallets: varchar('verified_wallets')
      .array()
      .$type<Address[]>()
      .notNull()
      .default(sql`ARRAY[]::varchar[]`),
  },
  (table) => {
    return {
      entityIdx: index().on(table.entityId),
      contractIdx: index().on(table.contractId),
      contractAddressChainIdIdx: index().on(
        table.contractAddress,
        table.chainId,
      ),
      verifiedWalletsIdx: index().on(table.verifiedWallets),
    }
  },
)

export const deploymentRebatesRelations = relations(
  deploymentRebates,
  ({ one }) => ({
    entity: one(entities, {
      fields: [deploymentRebates.entityId],
      references: [entities.id],
    }),
    contract: one(contracts, {
      fields: [deploymentRebates.contractId],
      references: [contracts.id],
    }),
  }),
)

export const getTotalRebatesClaimedByEntity = async (input: {
  db: Database
  entityId: Entity['id']
}) => {
  const { db, entityId } = input
  const result = await db
    .select({ value: sum(deploymentRebates.rebateAmount).mapWith(BigInt) })
    .from(deploymentRebates)
    .where(
      and(
        eq(deploymentRebates.entityId, entityId),
        eq(deploymentRebates.state, DeploymentRebateState.REBATE_SENT),
      ),
    )

  return result[0]?.value || BigInt(0)
}

/** Returns the sum of rebates associated with the given @param address */
export const getTotalRebatesClaimedByVerifiedWallet = async (input: {
  db: Database
  address: Address
}) => {
  const { db, address } = input

  const result = await db
    .select({
      value: sum(deploymentRebates.rebateAmount).mapWith(BigInt),
    })
    .from(deploymentRebates)
    .where(
      and(
        eq(deploymentRebates.state, DeploymentRebateState.REBATE_SENT),
        arrayContains(deploymentRebates.verifiedWallets, [address]),
      ),
    )

  return result[0]?.value || BigInt(0)
}

/**
 * Gets the total amount of rebates claimed based on the max between amount claimed by entity
 * and amount claimed by verified wallets.
 */
export const getTotalRebatesClaimed = async (input: {
  db: Database
  entityId: Entity['id']
}) => {
  const { db, entityId } = input
  const totalClaimedByEntity = await getTotalRebatesClaimedByEntity({
    db,
    entityId,
  })
  const cbVerifiedWallets = (
    await getWalletVerifications({ db, entityId })
  ).cbVerifiedWallets.map((cbWallet) => cbWallet.address)

  // Get the max claim amount across all cb verified wallets.
  const amountClaimedFromVerifiedWallets = (
    await Promise.all(
      cbVerifiedWallets.map((address) =>
        getTotalRebatesClaimedByVerifiedWallet({ db, address }),
      ),
    )
  ).reduce(
    (currentMax, currentValue) =>
      currentValue > currentMax ? currentValue : currentMax,
    BigInt(0),
  )

  return totalClaimedByEntity > amountClaimedFromVerifiedWallets
    ? totalClaimedByEntity
    : amountClaimedFromVerifiedWallets
}
