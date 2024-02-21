import type { EnvVars } from '@/envVarsSchema'

export const testEnvVars = {
  PORT: 3000,
  REDIS_URL: 'redis://redis:6379',
  SCREENING_SERVICE_URL: 'http://localhost:3001',
  ALCHEMY_RPC_URL_SEPOLIA: 'https://eth-mainnet.alchemyapi.io/v2/your-api-key',
  ALCHEMY_GAS_MANAGER_POLICY_ID_SEPOLIA: 'your-policy-id',
  ALCHEMY_RPC_URL_OP_SEPOLIA:
    'https://eth-mainnet.alchemyapi.io/v2/your-api-key',
  ALCHEMY_GAS_MANAGER_POLICY_ID_OP_SEPOLIA: 'your-policy-id',
} as const satisfies EnvVars
