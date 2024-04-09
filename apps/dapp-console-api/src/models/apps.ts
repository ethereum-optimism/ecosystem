import type { InferSelectModel } from 'drizzle-orm'
import { eq } from 'drizzle-orm'
import {
  index,
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

import type { NameCursor } from '@/api'
import type { Database } from '@/db'

import { entities } from './entities'
import { generateCursorSelect } from './utils'

export enum AppState {
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
      nameIdx: index().on(table.name),
    }
  },
)

export type App = InferSelectModel<typeof apps>

export const getActiveAppsForEntityByCursor = async (input: {
  db: Database
  entityId: App['entityId']
  limit: number
  cursor?: NameCursor
}) => {
  const { db, entityId, limit, cursor } = input

  return generateCursorSelect({
    db,
    table: apps,
    filters: [eq(apps.entityId, entityId), eq(apps.state, AppState.ACTIVE)],
    limit,
    orderBy: { direction: 'asc', column: 'name' },
    idColumnKey: 'id',
    cursor,
  })
}
