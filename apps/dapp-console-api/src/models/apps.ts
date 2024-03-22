import {
  index,
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

import { entities } from './entities'

enum AppState {
  ACTIVE = 'active',
  DISABLED = 'disabled',
}

export const apps = pgTable(
  'apps',
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
    chainId: integer('chain_id'),
    name: varchar('name').notNull(),
    state: varchar('state')
      .$type<AppState>()
      .default(AppState.ACTIVE)
      .notNull(),
  },
  (table) => {
    return {
      entityIdx: index().on(table.entityId),
    }
  },
)
