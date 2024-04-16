import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

import { envVars } from '@/constants/envVars'
import type { Database } from '@/db/Database'

export const mockDb: Database = drizzle(
  new Pool({
    user: envVars.DB_USER,
    password: envVars.DB_PASSWORD,
    host: envVars.DB_HOST,
    database: envVars.DB_NAME,
  }),
)
