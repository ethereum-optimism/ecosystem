import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Pool } from 'pg'

export type Database = NodePgDatabase

export type DatabaseOptions = {
  user: string | undefined
  database: string | undefined
  host: string | undefined
  port: number | undefined
  password?: string | undefined
  max?: number
}

export type MigrationOptions = {
  migrationsFolder?: string | undefined
}

const DEFAULT_DATABASE_MIGRATION_FOLDER = 'migrations'

export function connectToDatabase(options: DatabaseOptions): Database {
  const pool = new Pool(options)
  return drizzle(pool)
}

/**
 * This is a temporary function until we get our utility pod setup to run migrations
 */
export async function runMigrations(
  options: DatabaseOptions,
  migrationOptions: MigrationOptions = {},
) {
  const { migrationsFolder = DEFAULT_DATABASE_MIGRATION_FOLDER } =
    migrationOptions
  const migratorPool = new Pool({ ...options, max: 1 })
  await migrate(drizzle(migratorPool), {
    migrationsFolder: migrationsFolder,
  })
}
