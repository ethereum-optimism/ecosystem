import { config } from 'dotenv'
import { inferSchemas, parseEnv } from 'znv'
import { z } from 'zod'

config({ path: 'e2e.env' })

export const e2eEnvVars = parseEnv(
  process.env,
  inferSchemas({
    E2E_TEST_BASE_URL: {
      schema: z.string().default('http://0.0.0.0:7310'),
    },
    E2E_TEST_ADMIN_BASE_URL: {
      schema: z.string().default('http://0.0.0.0:9900'),
    },
  }),
)
