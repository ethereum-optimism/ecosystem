import 'dotenv/config'

import { inferSchemas } from 'znv'
import { z } from 'zod'

export const envVarsSchema = inferSchemas({
  PORT: {
    schema: z.number(),
    defaults: {
      test: 7310,
    },
  },
  ADMIN_API_PORT: {
    schema: z.number(),
    defaults: {
      test: 9900,
    },
  },
  SHOULD_ENABLE_ADMIN_API: {
    schema: z.boolean(),
    defaults: {
      test: false,
    },
  },
  DEPLOYMENT_ENV: {
    schema: z.enum(['production', 'staging', 'development']),
    defaults: {
      test: 'production' as const,
    },
  },
  SHOULD_TRUST_PROXY: {
    schema: z.boolean(),
    defaults: {
      test: false,
    },
  },
  API_KEY_SERVICE_URL: {
    schema: z.string(),
    defaults: {
      test: 'http://0.0.0.0:7330',
    },
  },
  REDIS_URL: {
    schema: z.string(),
    defaults: {
      test: 'redis://localhost:6379',
    },
  },
  DB_USER: {
    schema: z.string(),
    defaults: {
      test: 'paymaster-proxy@oplabs-local-web.iam',
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
      test: 'paymaster-proxy',
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
  SCREENING_SERVICE_URL: {
    schema: z.string(),
    defaults: {
      test: 'https://screening-service.localhost',
    },
  },
  ALCHEMY_RPC_URL_SEPOLIA: {
    schema: z.string(),
    defaults: {
      test: 'https://sepolia.g.alchemy.com/v2/testapikey',
    },
  },
  ALCHEMY_GAS_MANAGER_POLICY_ID_SEPOLIA: {
    schema: z.string(),
    defaults: {
      test: 'test-policy-id',
    },
  },
  ALCHEMY_APP_ID_SEPOLIA: {
    schema: z.string(),
    defaults: {
      test: 'test-sepolia-app-id',
    },
  },
  ALCHEMY_RPC_URL_OP_SEPOLIA: {
    schema: z.string(),
    defaults: {
      test: 'https://opt-sepolia.g.alchemy.com/v2/testapikey',
    },
  },
  ALCHEMY_GAS_MANAGER_POLICY_ID_OP_SEPOLIA: {
    schema: z.string(),
    defaults: {
      test: 'test-policy-id',
    },
  },
  ALCHEMY_APP_ID_OP_SEPOLIA: {
    schema: z.string(),
    defaults: {
      test: 'test-op-sepolia-app-id',
    },
  },
  ALCHEMY_RPC_URL_BASE_SEPOLIA: {
    schema: z.string(),
    defaults: {
      test: 'https://base-sepolia.g.alchemy.com/v2/testapikey',
    },
  },
  ALCHEMY_GAS_MANAGER_POLICY_ID_BASE_SEPOLIA: {
    schema: z.string(),
    defaults: {
      test: 'test-policy-id',
    },
  },
  ALCHEMY_APP_ID_BASE_SEPOLIA: {
    schema: z.string(),
    defaults: {
      test: 'test-base-sepolia-app-id',
    },
  },
  ALCHEMY_RPC_URL_ZORA_SEPOLIA: {
    schema: z.string(),
    defaults: {
      test: 'https://zora-sepolia.g.alchemy.com/v2/testapikey',
    },
  },
  ALCHEMY_GAS_MANAGER_POLICY_ID_ZORA_SEPOLIA: {
    schema: z.string(),
    defaults: {
      test: 'test-policy-id',
    },
  },
  ALCHEMY_APP_ID_ZORA_SEPOLIA: {
    schema: z.string(),
    defaults: {
      test: 'test-zora-sepolia-app-id',
    },
  },
  ALCHEMY_RPC_URL_FRAXTAL_SEPOLIA: {
    schema: z.string(),
    defaults: {
      test: 'https://fraxtal-sepolia.g.alchemy.com/v2/testapikey',
    },
  },
  ALCHEMY_GAS_MANAGER_POLICY_ID_FRAXTAL_SEPOLIA: {
    schema: z.string(),
    defaults: {
      test: 'test-policy-id',
    },
  },
  ALCHEMY_APP_ID_FRAXTAL_SEPOLIA: {
    schema: z.string(),
    defaults: {
      test: 'test-fraxtal-sepolia-app-id',
    },
  },
  ALCHEMY_GAS_MANAGER_ACCESS_KEY: {
    schema: z.string(),
    defaults: {
      test: 'test-gas-manager-access-key',
    },
  },
})
