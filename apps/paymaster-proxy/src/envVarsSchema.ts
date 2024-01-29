import { z } from 'zod'

export const envVarsSchema = z.object({
  PORT: z.coerce.number().describe('Port to listen on'),
})
