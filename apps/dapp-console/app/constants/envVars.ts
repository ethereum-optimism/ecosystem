import { z } from 'zod'

const schema = z.object({
  API_URL: z
    .string()
    .url()
    .default('https://dapp-console-api.optimism.io')
    .describe('Dapp Console Api URL'),
  GROWTHBOOK_ENDPOINT: z
    .string()
    .url()
    .default('https://cdn.growthbook.io/api/features/')
    .describe('Growthbook endpoint'),
  GROWTHBOOK_ENCRYPTION_KEY: z
    .string()
    .optional()
    .describe('Key for decrypting growthbook response'),
})

export const ENV_VARS = schema.parse({
  API_URL: process.env.NEXT_PUBLIC_API_URL,
  GROWTHBOOK_ENDPOINT: process.env.NEXT_PUBLIC_GROWTHBOOK_ENDPOINT,
  GROWTHBOOK_ENCRYPTION_KEY: process.env.NEXT_PUBLIC_GROWTHBOOK_ENCRYPTION_KEY,
})
