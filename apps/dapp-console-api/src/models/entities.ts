import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { eq, relations } from 'drizzle-orm'
import { jsonb, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import type { Address } from 'viem'

import type { Database } from '@/db'

import { apps } from './apps'
import { challenges } from './challenges'
import { contracts } from './contracts'
import { deploymentRebates } from './deploymentRebates'
import { transactions } from './transactions'
import { wallets } from './wallets'

export enum EntityState {
  ACTIVE = 'active',
  SANCTIONED = 'sanctioned',
}

export type SanctionInfo = {
  sanctionedAt: Date
  sanctionedAddress: Address
}

export const entities = pgTable('entities', {
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  id: uuid('id').defaultRandom().primaryKey(),
  privyDid: varchar('privy_did').unique().notNull(),
  state: varchar('state')
    .$type<EntityState>()
    .default(EntityState.ACTIVE)
    .notNull(),
  disabledAt: timestamp('disabled_at', { withTimezone: true }),
  sanctionInfo: jsonb('sanction_info').$type<SanctionInfo>(),
})

export const entitiesRelations = relations(entities, ({ many }) => ({
  wallets: many(wallets),
  transactions: many(transactions),
  contracts: many(contracts),
  apps: many(apps),
  challenges: many(challenges),
  deploymentRebates: many(deploymentRebates),
}))

export type Entity = InferSelectModel<typeof entities>
export type InsertEntity = InferInsertModel<typeof entities>

export const getEntityByEntityId = async (input: {
  db: Database
  entityId: Entity['id']
}): Promise<Entity | null> => {
  const { db, entityId } = input
  const results = await db
    .select()
    .from(entities)
    .where(eq(entities.id, entityId))

  return results[0] || null
}

export const getEntityByPrivyDid = async (
  db: Database,
  privyDid: Entity['privyDid'],
): Promise<Entity | null> => {
  const results = await db
    .select()
    .from(entities)
    .where(eq(entities.privyDid, privyDid))

  return results[0] || null
}

export const insertEntity = async (db: Database, newEntity: InsertEntity) => {
  const result = await db.insert(entities).values(newEntity).returning()

  return result[0]
}

export const sanctionEntity = async (input: {
  db: Database
  entityId: Entity['id']
  sanctionedAddress: Address
}) => {
  const { db, entityId, sanctionedAddress } = input

  return db
    .update(entities)
    .set({
      state: EntityState.SANCTIONED,
      updatedAt: new Date(),
      sanctionInfo: { sanctionedAt: new Date(), sanctionedAddress },
    })
    .where(eq(entities.id, entityId))
}
