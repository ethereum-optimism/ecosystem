import 'dotenv/config'

import { inferSchemas, parseEnv } from 'znv'
import { z } from 'zod'

const commaSeparatedRegExpSchema = z
  .string()
  .optional()
  .transform((val) => (val ? val.split(',').map((exp) => new RegExp(exp)) : []))

export const envVarsSchema = inferSchemas({
  PORT: {
    schema: z.number(),
    defaults: {
      test: 7330,
    },
  },
  DEPLOYMENT_ENV: {
    schema: z.enum(['production', 'staging', 'development']),
    defaults: {
      test: 'development' as const,
    },
  },
  DEV_CORS_ALLOWLIST_REG_EXP: {
    schema: commaSeparatedRegExpSchema,
    defaults: {
      test: '',
    },
  },
  CORS_ALLOWLIST_REG_EXP: {
    schema: commaSeparatedRegExpSchema,
    defaults: {
      test: '',
    },
  },
  DB_USER: {
    schema: z.string(),
    defaults: {
      test: 'api-key-service@oplabs-local-web.iam',
    },
  },
  DB_PASSWORD: {
    schema: z.string().optional(),
    defaults: {
      test: 'DB_PASSWORD',
    },
  },
  DB_HOST: {
    schema: z.string(),
    defaults: {
      test: '0.0.0.0',
    },
  },
  DB_PORT: {
    schema: z.number().int().positive(),
    defaults: {
      test: 5432,
    },
  },
  DB_NAME: {
    schema: z.string(),
    defaults: {
      test: 'api-key-service',
    },
  },
  DB_MAX_CONNECTIONS: {
    schema: z.number().int().positive(),
    defaults: {
      test: 3,
    },
  },
  MIGRATE_DB_USER: {
    schema: z.string(),
    defaults: {
      test: 'postgres',
    },
  },
  MIGRATE_DB_PASSWORD: {
    schema: z.string().optional(),
  },
  MIGRATE_INITIAL_RETRY_DELAY: {
    schema: z.number(),
    defaults: {
      test: 1,
    },
  },
  MIGRATE_MAX_RETRY_DELAY: {
    schema: z.number(),
    defaults: {
      test: 1,
    },
  },
  MIGRATE_MAX_RETRIES: {
    schema: z.number(),
    defaults: {
      test: 1,
    },
  },
})

export const envVars = parseEnv(process.env, envVarsSchema)
