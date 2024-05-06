import type {
  ExtractTablesWithRelations,
  InferInsertModel,
  InferSelectModel,
} from 'drizzle-orm'
import { and, arrayContains, eq, relations, sum } from 'drizzle-orm'
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
import { type Address, getAddress, type Hash } from 'viem'

import type { CreatedAtCursor } from '@/api'
import type { Database } from '@/db'

import { contracts } from './contracts'
import type { Entity } from './entities'
import { entities } from './entities'
import type * as schema from './schema'
import { generateCursorSelect, UINT256_PRECISION } from './utils'
import { getWalletVerifications } from './wallets'

export enum DeploymentRebateState {
  REBATE_FAILED_TO_SEND = 'rebate_failed_to_send',
  PENDING_SEND = 'pending_send',
  REBATE_SENT = 'rebate_sent',
}

export enum RejectionReason {}

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
    deploymentTxHash: varchar('deployment_tx_hash').$type<Hash>().notNull(),
    chainId: integer('chain_id').notNull(),
    state: varchar('state')
      .$type<DeploymentRebateState>()
      .default(DeploymentRebateState.PENDING_SEND)
      .notNull(),
    rejectionReason: varchar('rejection_reason').$type<RejectionReason>(),
    rebateTxHash: varchar('rebate_tx_hash').$type<Hash>(),
    rebateAmount: numeric('rebate_amount', {
      precision: UINT256_PRECISION,
      scale: 0,
    }),
    rebateTxTimestamp: timestamp('rebate_tx_timestamp', { withTimezone: true }),
    recipientAddress: varchar('recipient_address').$type<Address>(),
    /** The wallets used for verifying that the user is eligible for a rebate. */
    verifiedWallets: varchar('verified_wallets')
      .array()
      .$type<Address[]>()
      .notNull(),
  },
  (table) => {
    return {
      entityIdx: index().on(table.entityId),
      contractIdx: index().on(table.contractId),
      contractAddressChainIdIdx: uniqueIndex().on(
        table.contractAddress,
        table.chainId,
      ),
      deploymentTxHashChainIdIdx: uniqueIndex().on(
        table.deploymentTxHash,
        table.chainId,
      ),
      verifiedWalletsIdx: index().on(table.verifiedWallets),
      entityRebateTxTimestampIdx: index().on(
        table.entityId,
        table.rebateTxTimestamp,
      ),
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

export type DeploymentRebate = InferSelectModel<typeof deploymentRebates>
export type InsertDeploymentRebate = InferInsertModel<typeof deploymentRebates>

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

export const insertDeploymentRebate = async (input: {
  db: Database
  newRebate: InsertDeploymentRebate
}) => {
  const { db, newRebate } = input

  if (newRebate.verifiedWallets.length === 0) {
    throw new Error('must have verified wallet to claim rebate')
  }

  const checkSummedRebate = {
    ...newRebate,
    contractAddress: getAddress(newRebate.contractAddress),
    recipientAddress: getAddress(newRebate.recipientAddress!),
    verifiedWallets: newRebate.verifiedWallets.map((address) =>
      getAddress(address),
    ),
  }

  const results = await db
    .insert(deploymentRebates)
    .values(checkSummedRebate)
    .returning()

  return results[0]
}

export const setDeploymentRebateToSent = async (input: {
  db: Database
  entityId: DeploymentRebate['entityId']
  rebateId: DeploymentRebate['id']
  update: Pick<
    DeploymentRebate,
    'rebateAmount' | 'rebateTxHash' | 'rebateTxTimestamp'
  >
}) => {
  const { db, update, entityId, rebateId } = input
  const updateResult = await db
    .update(deploymentRebates)
    .set({
      ...update,
      state: DeploymentRebateState.REBATE_SENT,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(deploymentRebates.id, rebateId),
        eq(deploymentRebates.entityId, entityId),
      ),
    )
    .returning()

  return updateResult[0]
}

export const setDeploymentRebateToPending = async (input: {
  db: Database
  entityId: DeploymentRebate['entityId']
  rebateId: DeploymentRebate['id']
}) => {
  const { db, entityId, rebateId } = input
  const updateResult = await db
    .update(deploymentRebates)
    .set({
      state: DeploymentRebateState.PENDING_SEND,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(deploymentRebates.id, rebateId),
        eq(deploymentRebates.entityId, entityId),
      ),
    )
    .returning()

  return updateResult[0]
}

export const setDeploymentRebateToFailed = async (input: {
  db: Database
  entityId: DeploymentRebate['entityId']
  rebateId: DeploymentRebate['id']
}) => {
  const { db, entityId, rebateId } = input
  const updateResult = await db
    .update(deploymentRebates)
    .set({
      state: DeploymentRebateState.REBATE_FAILED_TO_SEND,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(deploymentRebates.id, rebateId),
        eq(deploymentRebates.entityId, entityId),
      ),
    )
    .returning()

  return updateResult[0]
}

export const getDeploymentRebateByChainIdTxHash = async (input: {
  db: Database
  chainId: DeploymentRebate['chainId']
  deploymentTxHash: DeploymentRebate['deploymentTxHash']
}): Promise<DeploymentRebate | null> => {
  const { db, chainId, deploymentTxHash } = input

  const results = await db
    .select()
    .from(deploymentRebates)
    .where(
      and(
        eq(deploymentRebates.chainId, chainId),
        eq(deploymentRebates.deploymentTxHash, deploymentTxHash),
      ),
    )

  return results[0] || null
}

export const getCompletedRebatesForEntityByCursor = async (input: {
  db: Database
  entityId: DeploymentRebate['entityId']
  limit: number
  cursor?: CreatedAtCursor
}) => {
  const { db, entityId, limit, cursor } = input

  return generateCursorSelect<
    typeof deploymentRebates,
    ExtractTablesWithRelations<typeof schema>['deploymentRebates'],
    ExtractTablesWithRelations<typeof schema>,
    typeof db.query.deploymentRebates,
    'createdAt',
    'id',
    {}
  >({
    queryBuilder: db.query.deploymentRebates,
    withSelector: {},
    table: deploymentRebates,
    filters: [
      eq(deploymentRebates.entityId, entityId),
      eq(deploymentRebates.state, DeploymentRebateState.REBATE_SENT),
    ],
    limit,
    orderBy: { direction: 'desc', column: 'createdAt' },
    idColumnKey: 'id',
    cursor,
  })
}
