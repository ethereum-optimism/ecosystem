import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { and, eq, isNull } from 'drizzle-orm'
import {
  index,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

import type { Database } from '@/db/Database'

export type ApiKeyState = 'enabled' | 'disabled'

export const apiKeys = pgTable(
  'api-keys',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    entityId: uuid('entity_id').notNull(),
    key: varchar('key').notNull(),
    state: varchar('state').$type<ApiKeyState>().notNull(),
    stateUpdatedAt: timestamp('state_updated_at', { withTimezone: true }),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      deletedAtIdx: index().on(table.deletedAt),
      entityDeletedAtIdx: index().on(table.entityId, table.deletedAt),
      keyIdx: uniqueIndex().on(table.key), // cannot allow duplicate keys
    }
  },
)

export type ApiKey = InferSelectModel<typeof apiKeys>
export type InsertApiKey = InferInsertModel<typeof apiKeys>
export type UpdateApiKey = Partial<Pick<ApiKey, 'state'>>

export const getApiKey = async (db: Database, id: string) => {
  const keys = await db
    .select()
    .from(apiKeys)
    .where(and(eq(apiKeys.id, id), isNull(apiKeys.deletedAt)))

  if (keys.length === 0) {
    return null
  }

  return keys[0]
}

export const createApiKey = async (
  db: Database,
  newApiKey: InsertApiKey & {
    state: 'enabled' | 'disabled'
  }, // Ensures that state is either 'enabled' or 'disabled' on creation
) => {
  const currentTime = new Date()
  const insertValues = {
    ...newApiKey,
    createdAt: currentTime,
    updatedAt: currentTime,
    stateUpdatedAt: currentTime,
  }

  const result = await db.insert(apiKeys).values(insertValues).returning()

  return result[0]
}
