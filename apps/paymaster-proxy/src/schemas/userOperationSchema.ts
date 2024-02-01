import { Address as addressSchema } from 'abitype/zod'
import { z } from 'zod'

import { hexSchema } from '@/schemas/hexSchema'

export const userOperationSchema = z.object({
  sender: addressSchema,
  nonce: z.bigint(),
  initCode: hexSchema,
  callData: hexSchema,
  callGasLimit: z.bigint(),
  verificationGasLimit: z.bigint(),
  preVerificationGas: z.bigint(),
  maxFeePerGas: z.bigint(),
  maxPriorityFeePerGas: z.bigint(),
  paymasterAndData: hexSchema,
  signature: hexSchema,
})
