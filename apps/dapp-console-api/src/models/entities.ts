import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { and, eq } from 'drizzle-orm'
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

import type { Database } from '@/db'

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
