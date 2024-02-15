import { z } from 'zod'

export const envVarsSchema = z.object({
  PORT: z.coerce.number().describe('Port to listen on'),
  REDIS_URL: z.string().describe('URL of Redis instance'),
  ALCHEMY_RPC_URL_SEPOLIA: z.string().describe('Alchemy RPC URL for Sepolia'),
  ALCHEMY_GAS_MANAGER_POLICY_ID_SEPOLIA: z
    .string()
    .describe('Alchemy Gas Manager policyId for Sepolia'),
  ALCHEMY_RPC_URL_OP_SEPOLIA: z
    .string()
    .describe('Alchemy RPC URL for OP Sepolia'),
  ALCHEMY_GAS_MANAGER_POLICY_ID_OP_SEPOLIA: z
    .string()
    .describe('Alchemy Gas Manager policyId for OP Sepolia'),
})
