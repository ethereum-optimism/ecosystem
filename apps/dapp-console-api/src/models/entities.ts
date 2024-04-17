import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { and, eq, relations } from 'drizzle-orm'
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

import type { Database } from '@/db'

import { apps } from './apps'
import { challenges } from './challenges'
import { contracts } from './contracts'
import { deploymentRebates } from './deploymentRebates'
import { transactions } from './transactions'
import { wallets } from './wallets'

export enum EntityState {
  ACTIVE = 'active',
  DISABLED = 'disabled',
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

export const getEntityByPrivyDid = async (
  db: Database,
  privyDid: Entity['privyDid'],
): Promise<Entity | null> => {
  const results = await db
    .select()
    .from(entities)
    .where(
      and(
        eq(entities.privyDid, privyDid),
        eq(entities.state, EntityState.ACTIVE),
      ),
    )

  return results[0] || null
}

export const insertEntity = async (db: Database, newEntity: InsertEntity) => {
  const result = await db.insert(entities).values(newEntity).returning()

  return result[0]
}
