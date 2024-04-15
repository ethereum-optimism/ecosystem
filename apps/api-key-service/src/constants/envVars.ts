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
  DB_USER: z.string(),
  DB_PASSWORD: z.string().optional(),
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
        DB_USER: 'api-key-service@oplabs-local-web.iam',
        DB_PASSWORD: 'DB_PASSWORD',
        DB_HOST: '0.0.0.0',
        DB_PORT: 5432,
        DB_NAME: 'api-key-service',
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
        DB_USER: process.env.DB_USER,
        DB_HOST: process.env.DB_HOST ?? 'localhost',
        DB_PORT: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
        DB_MAX_CONNECTIONS:
          process.env.DB_MAX_CONNECTIONS &&
          Number(process.env.DB_MAX_CONNECTIONS),
        DB_NAME: process.env.DB_NAME ?? 'api-key-service',
      },
)
