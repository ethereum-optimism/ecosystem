import {
  index,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

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
