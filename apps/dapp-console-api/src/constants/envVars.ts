import 'dotenv/config'

import type { Hex } from 'viem'
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
  PRIVY_ACCESS_TOKEN_SALT: z.string(),
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
  PRIVY_APP_ID: z.string(),
  PRIVY_APP_SECRET: z.string(),
  MAX_APPS_COUNT: z.number().min(1).default(20),
  OP_MAINNET_JSON_RPC_URL: z.string(),
  DEPLOYMENT_REBATE_WALLET_PK: z.custom<Hex>(),
  OP_SEPOLIA_DEPLOYMENT_REBATE_WALLET_PK: z.custom<Hex>(),
  /** Max rebate amount in units of ether */
  MAX_REBATE_AMOUNT: z.string().default('.05'),
  INCLUDE_TESTNETS: z.boolean().default(false),
  MAINNET_JSON_RPC_URL: z.string(),
  BASE_JSON_RPC_URL: z.string(),
  FRAX_JSON_RPC_URL: z.string(),
  MODE_JSON_RPC_URL: z.string(),
  ZORA_JSON_RPC_URL: z.string(),
  SEPOLIA_JSON_RPC_URL: z.string().optional(),
  BASE_SEPOLIA_JSON_RPC_URL: z.string().optional(),
  FRAX_SEPOLIA_JSON_RPC_URL: z.string().optional(),
  LISK_SEPOLIA_JSON_RPC_URL: z.string().optional(),
  MODE_SEPOLIA_JSON_RPC_URL: z.string().optional(),
  OP_SEPOLIA_JSON_RPC_URL: z.string().optional(),
  ZORA_SEPOLIA_JSON_RPC_URL: z.string().optional(),
  REDIS_URL: z.string().describe('URL of Redis instance'),
  RATE_LIMIT: z.number(),
  RATE_LIMIT_WINDOW_MS: z.number(),
  SCREENING_SERVICE_URL: z.string(),
  PERFORM_ADDRESS_SCREENING: z.boolean().default(true),
  CB_VERIFICATION_EAS_API_URL: z
    .string()
    .default('https://base.easscan.org/graphql'),
  CB_VERIFICATION_SCHEMA_ID: z
    .string()
    .default(
      '0xf8b05c79f090979bf4a80270aba232dff11a10d9ca55c4f88de95317970f0de9',
    ),
  CB_VERIFICATION_ATTESTER: z
    .string()
    .default('0x357458739F90461b99789350868CD7CF330Dd7EE'),
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
        PRIVY_APP_ID: 'PRIVY_APP_ID',
        PRIVY_APP_SECRET: 'PRIVY_APP_SECRET',
        PRIVY_ACCESS_TOKEN_SALT: '$2b$10$Kd085thA56nZmQiRHh2XHu',
        OP_MAINNET_JSON_RPC_URL: 'OP_MAINNET_JSON_RPC_URL',
        DEPLOYMENT_REBATE_WALLET_PK: 'DEPLOYMENT_REBATE_WALLET_PK',
        OP_SEPOLIA_DEPLOYMENT_REBATE_WALLET_PK:
          'OP_SEPOLIA_DEPLOYMENT_REBATE_WALLET_PK',
        MAX_REBATE_AMOUNT: '.05',
        INCLUDE_TESTNETS: false,
        MAINNET_JSON_RPC_URL: 'MAINNET_JSON_RPC_URL',
        BASE_JSON_RPC_URL: 'BASE_JSON_RPC_URL',
        FRAX_JSON_RPC_URL: 'FRAX_JSON_RPC_URL',
        MODE_JSON_RPC_URL: 'MODE_JSON_RPC_URL',
        ZORA_JSON_RPC_URL: 'ZORA_JSON_RPC_URL',
        SEPOLIA_JSON_RPC_URL: 'SEPOLIA_JSON_RPC_URL',
        BASE_SEPOLIA_JSON_RPC_URL: 'BASE_SEPOLIA_JSON_RPC_URL',
        FRAX_SEPOLIA_JSON_RPC_URL: 'FRAX_SEPOLIA_JSON_RPC_URL',
        LISK_SEPOLIA_JSON_RPC_URL: 'LISK_SEPOLIA_JSON_RPC_URL',
        MODE_SEPOLIA_JSON_RPC_URL: 'MODE_SEPOLIA_JSON_RPC_URL',
        OP_SEPOLIA_JSON_RPC_URL: 'OP_SEPOLIA_JSON_RPC_URL',
        ZORA_SEPOLIA_JSON_RPC_URL: 'ZORA_SEPOLIA_JSON_RPC_URL',
        REDIS_URL: 'REDIS_URL',
        RATE_LIMIT: 100,
        RATE_LIMIT_WINDOW_MS: 1 * 60 * 1000,
        SCREENING_SERVICE_URL: 'SCREENING_SERVICE_URL',
        PERFORM_ADDRESS_SCREENING: false,
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
        PRIVY_APP_ID: process.env.PRIVY_APP_ID,
        PRIVY_APP_SECRET: process.env.PRIVY_APP_SECRET,
        PRIVY_ACCESS_TOKEN_SALT: process.env.PRIVY_ACCESS_TOKEN_SALT,
        MAX_APPS_COUNT: process.env.MAX_APPS_COUNT,
        OP_MAINNET_JSON_RPC_URL: process.env.OP_MAINNET_JSON_RPC_URL,
        DEPLOYMENT_REBATE_WALLET_PK: process.env.DEPLOYMENT_REBATE_WALLET_PK,
        OP_SEPOLIA_DEPLOYMENT_REBATE_WALLET_PK:
          process.env.OP_SEPOLIA_DEPLOYMENT_REBATE_WALLET_PK,
        MAX_REBATE_AMOUNT: process.env.MAX_REBATE_AMOUNT,
        INCLUDE_TESTNETS: process.env.INCLUDE_TESTNETS
          ? Boolean(process.env.INCLUDE_TESTNETS === 'true')
          : false,
        MAINNET_JSON_RPC_URL: process.env.MAINNET_JSON_RPC_URL,
        BASE_JSON_RPC_URL: process.env.BASE_JSON_RPC_URL,
        FRAX_JSON_RPC_URL: process.env.FRAX_JSON_RPC_URL,
        MODE_JSON_RPC_URL: process.env.MODE_JSON_RPC_URL,
        ZORA_JSON_RPC_URL: process.env.ZORA_JSON_RPC_URL,
        SEPOLIA_JSON_RPC_URL: process.env.SEPOLIA_JSON_RPC_URL,
        BASE_SEPOLIA_JSON_RPC_URL: process.env.BASE_SEPOLIA_JSON_RPC_URL,
        FRAX_SEPOLIA_JSON_RPC_URL: process.env.FRAX_SEPOLIA_JSON_RPC_URL,
        LISK_SEPOLIA_JSON_RPC_URL: process.env.LISK_SEPOLIA_JSON_RPC_URL,
        MODE_SEPOLIA_JSON_RPC_URL: process.env.MODE_SEPOLIA_JSON_RPC_URL,
        OP_SEPOLIA_JSON_RPC_URL: process.env.OP_SEPOLIA_JSON_RPC_URL,
        ZORA_SEPOLIA_JSON_RPC_URL: process.env.ZORA_SEPOLIA_JSON_RPC_URL,
        REDIS_URL: process.env.REDIS_URL,
        RATE_LIMIT: process.env.RATE_LIMIT
          ? Number(process.env.RATE_LIMIT)
          : 100,
        RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS
          ? Number(process.env.RATE_LIMIT_WINDOW_MS)
          : 1 * 60 * 1000, // 1 minute
        SCREENING_SERVICE_URL: process.env.SCREENING_SERVICE_URL,
        PERFORM_ADDRESS_SCREENING: process.env.PERFORM_ADDRESS_SCREENING
          ? Boolean(process.env.PERFORM_ADDRESS_SCREENING === 'true')
          : true,
        CB_VERIFICATION_EAS_API_URL: process.env.CB_VERIFICATION_EAS_API_URL,
        CB_VERIFICATION_SCHEMA_ID: process.env.CB_VERIFICATION_SCHEMA_ID,
        CB_VERIFICATION_ATTESTER: process.env.CB_VERIFICATION_ATTESTER,
      },
)
