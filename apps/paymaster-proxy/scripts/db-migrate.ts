import 'dotenv/config'

import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Pool } from 'pg'

const DATABASE_MIGRATION_FOLDER = 'migrations'

const migrateDBUser = process.env.MIGRATE_DB_USER ?? 'postgres'
const migrateDBPassword = process.env.MIGRATE_DB_PASSWORD ?? ''
const dbHost = process.env.DB_HOST ?? 'localhost'
const dbPort = process.env.DB_HOST ? Number(process.env.DB_PORT) : 5432
const dbName = process.env.DB_NAME ?? 'paymaster-proxy'

const connectionOptions = {
  connectionString: `postgresql://${migrateDBUser}:${migrateDBPassword}@${dbHost}:${dbPort}/${dbName}`,
  max: 1,
}

const migrationOptions = {
  migrationsFolder: DATABASE_MIGRATION_FOLDER,
}

/**
 * This will run all migrations under the migrations folder one by one
 * until the database is on the latest schema version. In order to
 * generate migrations after creating models run the below command.
 *
 * pnpm nx run @eth-optimism/paymaster-proxy:migrations:generate
 *
 **/
async function main() {
  const db = drizzle(new Pool(connectionOptions))
  await migrate(db, migrationOptions)
}

function handleError(e: unknown) {
  if (e instanceof Error) {
    console.error(e) // eslint-disable-line no-console
  }
  process.exit(-1)
}

;(async () => {
  try {
    console.log('Starting...') // eslint-disable-line no-console
    await main()
    console.log('success') // eslint-disable-line no-console
    process.exit(0)
  } catch (e: any) {
    handleError(e)
  }
})().catch((e: unknown) => {
  handleError(e)
})
