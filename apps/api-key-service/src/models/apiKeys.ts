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
  newApiKey: InsertApiKey, // Ensures that state is either 'enabled' or 'disabled' on creation
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

export const deleteApiKey = async (db: Database, apiKeyId: string) => {
  const currentTime = new Date()

  await db
    .update(apiKeys)
    .set({
      deletedAt: currentTime,
      updatedAt: currentTime,
    })
    .where(eq(apiKeys.id, apiKeyId))
}

export const updateApiKeyState = async (
  db: Database,
  apiKeyId: string,
  newState: ApiKeyState,
) => {
  const currentTime = new Date()

  const updatedApiKeys = await db
    .update(apiKeys)
    .set({
      state: newState,
      updatedAt: currentTime,
      stateUpdatedAt: currentTime,
    })
    .where(and(eq(apiKeys.id, apiKeyId), isNull(apiKeys.deletedAt)))
    .returning()

  if (updatedApiKeys.length === 0) {
    return null
  }

  // guaranteed to only be 1 max because of the primaryKey filter
  return updatedApiKeys[0]
}

const MAX_FETCH_LIMIT = 100

export const listApiKeysForEntity = async (db: Database, entityId: string) => {
  return await db
    .select()
    .from(apiKeys)
    .where(and(eq(apiKeys.entityId, entityId), isNull(apiKeys.deletedAt)))
    .limit(MAX_FETCH_LIMIT)
  // TODO: consider adding pagination support
}

export const getApiKeyByKey = async (db: Database, key: string) => {
  const keys = await db
    .select()
    .from(apiKeys)
    .where(and(eq(apiKeys.key, key), isNull(apiKeys.deletedAt)))

  if (keys.length === 0) {
    return null
  }

  // guaranteed to only be 1 max because of the unique index on key
  return keys[0]
}
