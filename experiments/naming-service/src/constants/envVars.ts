import 'dotenv/config'

import { z } from 'zod'

const getCommaSeparatedValues = (type: string) => {
  try {
    return process.env[type]?.split(',') ?? []
  } catch (e) {
    throw new Error(`Unable to parse rpc urls: ${e}`)
  }
}

const envVarSchema = z.object({
  PORT: z.number(),
  DEPLOYMENT_ENV: z.enum(['production', 'staging', 'development']),
  DEV_CORS_ALLOWLIST_REG_EXP: z.custom<RegExp>().array(),
  CORS_ALLOWLIST_REG_EXP: z.custom<RegExp>().array(),
  IRON_SESSION_SECRET: z
    .string()
    .min(32)
    .max(32)
    .describe('32 character iron session secret'),
  ADMIN_API_PASSWORD: z.string().optional(),
  ADMIN_API_SALT: z.string().optional(),
  RESOLVER_PRIVATE_KEY: z.string(),
  DB_USER: z.string(),
  MIGRATE_DB_USER: z.string(),
  DB_PASSWORD: z.string().optional(),
  MIGRATE_DB_PASSWORD: z.string().optional(),
  MIGRATE_INITIAL_RETRY_DELAY: z.number().int().min(1),
  MIGRATE_MAX_RETRY_DELAY: z.number().int().min(1),
  MIGRATE_MAX_RETRIES: z.number().int().min(1),
  DB_HOST: z.string().optional(),
  DB_PORT: z.number().optional(),
  DB_NAME: z.string().optional(),
  DB_MAX_CONNECTIONS: z.number().int().min(1).optional(),
})

const isTest = process.env.NODE_ENV === 'test'

/**
 * A typesafe wrapper around process.env that sets defaults
 */
export const envVars = envVarSchema.parse(
  isTest
    ? {
        /**
         * We want the env vars in tests to always be consistent
         * To change them consider mocking them explicitly in test
         * rather than using env file
         * @example
         * jest.mock('../constants/envVars', () => ({
         *  envVars: {
         *      MOCKED_VARIABLE: true
         * }))
         */
        PORT: 7300,
        DEPLOYMENT_ENV: 'development',
        DEV_CORS_ALLOWLIST_REG_EXP: getCommaSeparatedValues(
          'DEV_CORS_ALLOWLIST_REG_EXP',
        ).map((regExp) => new RegExp(regExp)),
        CORS_ALLOWLIST_REG_EXP: getCommaSeparatedValues(
          'CORS_ALLOWLIST_REG_EXP',
        ).map((regExp) => new RegExp(regExp)),
        IRON_SESSION_SECRET: 'UNKNOWN_IRON_SESSION_PASSWORD_32',
        RESOLVER_PRIVATE_KEY: 'RESOLVER_PRIVATE_KEY',
        DB_USER: 'dapp-console-api@oplabs-local-web.iam',
        MIGRATE_DB_USER: 'postgres',
        DB_PASSWORD: 'DB_PASSWORD',
        MIGRATE_DB_PASSWORD: 'MIGRATE_DB_PASSWORD',
        DB_HOST: '0.0.0.0',
        DB_PORT: 5432,
        DB_NAME: 'dapp-console',
        MIGRATE_INITIAL_RETRY_DELAY: 1,
        MIGRATE_MAX_RETRY_DELAY: 1,
        MIGRATE_MAX_RETRIES: 1,
      }
    : {
        PORT: process.env.PORT
          ? Number(process.env.PORT)
          : process.env.SERVER_PORT
            ? Number(process.env.SERVER_PORT)
            : 7300,
        DEPLOYMENT_ENV: process.env.DEPLOYMENT_ENV ?? 'staging',
        DEV_CORS_ALLOWLIST_REG_EXP: getCommaSeparatedValues(
          'DEV_CORS_ALLOWLIST_REG_EXP',
        ).map((regExp) => new RegExp(regExp)),
        CORS_ALLOWLIST_REG_EXP: getCommaSeparatedValues(
          'CORS_ALLOWLIST_REG_EXP',
        ).map((regExp) => new RegExp(regExp)),
        IRON_SESSION_SECRET: process.env.IRON_SESSION_SECRET,
        ADMIN_API_PASSWORD: process.env.ADMIN_API_PASSWORD,
        ADMIN_API_SALT: process.env.ADMIN_API_SALT,
        RESOLVER_PRIVATE_KEY: process.env.RESOLVER_PRIVATE_KEY,
        DB_USER: process.env.DB_USER,
        MIGRATE_DB_USER: process.env.MIGRATE_DB_USER,
        DB_PASSWORD: process.env.DB_PASSWORD,
        MIGRATE_DB_PASSWORD: process.env.MIGRATE_DB_PASSWORD,
        DB_HOST: process.env.DB_HOST ?? 'localhost',
        DB_PORT: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
        DB_MAX_CONNECTIONS:
          process.env.DB_MAX_CONNECTIONS &&
          Number(process.env.DB_MAX_CONNECTIONS),
        DB_NAME: process.env.DB_NAME ?? 'dapp-console',
        MIGRATE_INITIAL_RETRY_DELAY:
          process.env.MIGRATE_INITIAL_RETRY_DELAY ?? 30000,
        MIGRATE_MAX_RETRY_DELAY: process.env.MIGRATE_MAX_RETRY_DELAY ?? 120000,
        MIGRATE_MAX_RETRIES: process.env.MIGRATE_MAX_RETRIES ?? 3,
      },
)
