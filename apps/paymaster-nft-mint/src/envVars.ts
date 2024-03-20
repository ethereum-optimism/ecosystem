import { z } from 'zod'

const schema = z.object({
  VITE_RPC_URL_SEPOLIA: z.string(),
  VITE_BUNDLER_RPC_URL_SEPOLIA: z.string(),
  VITE_PAYMASTER_RPC_URL_SEPOLIA: z.string(),

  VITE_RPC_URL_OP_SEPOLIA: z.string(),
  VITE_BUNDLER_RPC_URL_OP_SEPOLIA: z.string(),
  VITE_PAYMASTER_RPC_URL_OP_SEPOLIA: z.string(),

  VITE_RPC_URL_ZORA_SEPOLIA: z.string(),
  VITE_BUNDLER_RPC_URL_ZORA_SEPOLIA: z.string(),
  VITE_PAYMASTER_RPC_URL_ZORA_SEPOLIA: z.string(),
})

export const envVars = schema.parse(import.meta.env)
