import { inferSchemas } from 'znv'
import { z } from 'zod'

const commaSeparatedRegExpSchema = z
  .string()
  .optional()
  .transform((val) => (val ? val.split(',').map((exp) => new RegExp(exp)) : []))

export const envVarsSchema = inferSchemas({
  PORT: {
    schema: z.number(),
    defaults: {
      test: 7300,
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
  IRON_SESSION_SECRET: {
    schema: z.string().min(32).max(32),
    defaults: {
      test: 'UNKNOWN_IRON_SESSION_PASSWORD_32',
    },
  },
  ADMIN_API_PASSWORD: {
    schema: z.string().optional(),
  },
  ADMIN_API_SALT: {
    schema: z.string().optional(),
  },
})
