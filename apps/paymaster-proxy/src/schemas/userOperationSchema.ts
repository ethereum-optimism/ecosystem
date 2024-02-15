import { Address as addressSchema } from 'abitype/zod'
import { z } from 'zod'

import { hexSchema } from '@/schemas/hexSchema'

export const userOperationSchema = z.object({
  sender: addressSchema,
  nonce: hexSchema,
  initCode: hexSchema,
  callData: hexSchema,
  signature: hexSchema,
  callGasLimit: hexSchema.optional(),
  verificationGasLimit: hexSchema.optional(),
  preVerificationGas: hexSchema.optional(),
  maxFeePerGas: hexSchema.optional(),
  maxPriorityFeePerGas: hexSchema.optional(),
  paymasterAndData: hexSchema.optional(),
})

export type UserOperation = z.infer<typeof userOperationSchema>
