import { Address as addressSchema } from 'abitype/zod'
import { z } from 'zod'

import { hexSchema } from '@/schemas/hexSchema'

export const userOperationSchema = z.object({
  sender: addressSchema,
  nonce: hexSchema,
  initCode: hexSchema,
  callData: hexSchema,
  callGasLimit: hexSchema,
  verificationGasLimit: hexSchema,
  preVerificationGas: hexSchema,
  maxFeePerGas: hexSchema,
  maxPriorityFeePerGas: hexSchema,
  paymasterAndData: hexSchema,
  signature: hexSchema,
})

export type UserOperation = z.infer<typeof userOperationSchema>
