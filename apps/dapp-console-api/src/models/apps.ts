import type {
  ExtractTablesWithRelations,
  InferInsertModel,
  InferSelectModel,
} from 'drizzle-orm'
import { and, count, eq, relations } from 'drizzle-orm'
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

import { contracts } from './contracts'
import { entities } from './entities'
import type * as schema from './schema'
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

export const appsRelations = relations(apps, ({ one, many }) => ({
  entity: one(entities),
  contracts: many(contracts),
}))

export type App = InferSelectModel<typeof apps>
export type InsertApp = InferInsertModel<typeof apps>
export type UpdateApp = Partial<Pick<App, 'name' | 'state'>>

export const getActiveAppsForEntityByCursor = async (input: {
  db: Database
  entityId: App['entityId']
  limit: number
  cursor?: NameCursor
}) => {
  const { db, entityId, limit, cursor } = input

  return generateCursorSelect<
    typeof apps,
    ExtractTablesWithRelations<typeof schema>['apps'],
    ExtractTablesWithRelations<typeof schema>,
    typeof db.query.apps,
    'name',
    'id',
    { contracts: true }
  >({
    queryBuilder: db.query.apps,
    withSelector: { contracts: true },
    table: apps,
    filters: [eq(apps.entityId, entityId), eq(apps.state, AppState.ACTIVE)],
    limit,
    orderBy: { direction: 'asc', column: 'name' },
    idColumnKey: 'id',
    cursor,
  })
}

export const getActiveAppsCount = async (input: {
  db: Database
  entityId: App['entityId']
}) => {
  const { db, entityId } = input

  const results = await db
    .select({ count: count() })
    .from(apps)
    .where(and(eq(apps.entityId, entityId), eq(apps.state, AppState.ACTIVE)))

  return results[0]?.count || 0
}

export const insertApp = async (input: { db: Database; newApp: InsertApp }) => {
  const { db, newApp } = input
  const result = await db.insert(apps).values(newApp).returning()

  return result[0]
}

export const updateApp = async (input: {
  db: Database
  entityId: App['entityId']
  appId: App['id']
  update: UpdateApp
}) => {
  const { entityId, appId, db, update } = input

  return db
    .update(apps)
    .set({ ...update, updatedAt: new Date() })
    .where(and(eq(apps.id, appId), eq(apps.entityId, entityId)))
}
