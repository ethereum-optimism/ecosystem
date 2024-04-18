import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { and, asc, eq, relations } from 'drizzle-orm'
import {
  index,
  integer,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import type { Address, Hash } from 'viem'
import { getAddress } from 'viem'

import type { Database } from '@/db'

import { apps } from './apps'
import { challenges } from './challenges'
import { deploymentRebates } from './deploymentRebates'
import type { Entity } from './entities'
import { entities } from './entities'
import type { Transaction } from './transactions'
import { transactions } from './transactions'

export enum ContractState {
  NOT_VERIFIED = 'not_verified',
  VERIFIED = 'verified',
}

export type ContractWithTxAndEntity = Contract & {
  transaction: Transaction | null
} & { entity: Entity | null }

export const contracts = pgTable(
  'contracts',
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
    chainId: integer('chain_id').notNull(),
    appId: uuid('app_id')
      .references(() => apps.id)
      .notNull(),
    name: varchar('name'),
    contractAddress: varchar('contract_address').$type<Address>().notNull(),
    deployerAddress: varchar('deployer_address').$type<Address>().notNull(),
    deploymentTxHash: varchar('deployment_tx_hash').$type<Hash>().notNull(),
    state: varchar('state')
      .$type<ContractState>()
      .default(ContractState.NOT_VERIFIED)
      .notNull(),
  },
  (table) => {
    return {
      entityChainContractIdx: uniqueIndex().on(
        table.entityId,
        table.chainId,
        table.contractAddress,
      ),
      entityIdx: index().on(table.entityId),
      appIdx: index().on(table.appId),
      contractAddressIdx: index().on(table.contractAddress),
      deployerAddress: index().on(table.deployerAddress),
      entityIdcreatedAtIdx: index().on(table.entityId, table.createdAt),
    }
  },
)

export const contractsRelations = relations(contracts, ({ one }) => ({
  app: one(apps, { fields: [contracts.appId], references: [apps.id] }),
  transaction: one(transactions, {
    fields: [contracts.id],
    references: [transactions.contractId],
  }),
  entity: one(entities, {
    fields: [contracts.entityId],
    references: [entities.id],
  }),
  deploymentRebate: one(deploymentRebates, {
    fields: [contracts.id],
    references: [deploymentRebates.contractId],
  }),
  challenge: one(challenges, {
    fields: [contracts.id],
    references: [challenges.contractId],
  }),
}))

export type Contract = InferSelectModel<typeof contracts>
export type InsertContract = InferInsertModel<typeof contracts>

export const getContractsForApp = async (input: {
  db: Database
  entityId: Contract['entityId']
  appId: Contract['appId']
}) => {
  const { db, appId, entityId } = input

  return db.query.contracts.findMany({
    with: { entity: true, transaction: true },
    where: and(eq(contracts.appId, appId), eq(contracts.entityId, entityId)),
    orderBy: asc(contracts.createdAt),
  })
}

export const getContract = async (input: {
  db: Database
  contractId: Contract['id']
  entityId: Contract['entityId']
}): Promise<ContractWithTxAndEntity | null> => {
  const { db, contractId, entityId } = input

  const results = await db.query.contracts.findMany({
    with: { entity: true, transaction: true },
    where: and(eq(contracts.id, contractId), eq(contracts.entityId, entityId)),
  })

  return results[0] || null
}

export const hasAlreadyVerifiedDeployer = async (input: {
  db: Database
  entityId: Contract['entityId']
  deployerAddress: Address
}) => {
  const { db, entityId, deployerAddress } = input

  const results = await db
    .select()
    .from(contracts)
    .where(
      and(
        eq(contracts.entityId, entityId),
        eq(contracts.state, ContractState.VERIFIED),
        eq(contracts.deployerAddress, getAddress(deployerAddress)),
      ),
    )
    .limit(1)

  return results.length > 0
}

export const insertContract = async (input: {
  db: Database
  contract: InsertContract
}) => {
  const { contract, db } = input
  const normalizedContract = {
    ...contract,
    contractAddress: getAddress(contract.contractAddress),
    deployerAddress: getAddress(contract.deployerAddress),
  }
  const results = await db
    .insert(contracts)
    .values(normalizedContract)
    .returning()

  return results[0]
}

export const verifyContract = async (input: {
  db: Database
  entityId: Contract['entityId']
  contractId: Contract['id']
}) => {
  const { db, entityId, contractId } = input

  const results = await db
    .update(contracts)
    .set({ state: ContractState.VERIFIED, updatedAt: new Date() })
    .where(and(eq(contracts.entityId, entityId), eq(contracts.id, contractId)))
    .returning()

  return results[0]
}
