import * as dotenv from 'dotenv'
import type { Config } from 'drizzle-kit'

dotenv.config()

export default {
  schema: './src/models/*',
  out: './migrations',
  driver: 'pg',
  dbCredentials: {
    host: process.env.DB_HOST ?? '0.0.0.0',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    user: process.env.MIGRATE_DB_USER,
    password: process.env.MIGRATE_DB_PASSWORD,
    database: process.env.DB_NAME ?? 'api-key-service',
  },
} satisfies Config
