import { z } from 'zod'

export const envVarsSchema = z.object({
  PORT: z.coerce.number().describe('Port to listen on'),
  REDIS_URL: z.string().describe('URL of Redis instance'),
})
