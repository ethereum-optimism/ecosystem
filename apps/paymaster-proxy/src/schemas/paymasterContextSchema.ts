import { z } from 'zod'

export const paymasterContextSchema = z.object({
  policyId: z.string().min(1),
})
