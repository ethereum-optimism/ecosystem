import { Address as addressSchema } from 'abitype/zod'
import { z } from 'zod'

import { createJsonRpcRequestSchema } from '@/schemas/createJsonRpcRequestSchema'
import { userOperationSchema } from '@/schemas/userOperationSchema'

export const pmSponsorUserOperationRequestSchema = createJsonRpcRequestSchema(
  'pm_sponsorUserOperation',
  z.tuple([userOperationSchema, addressSchema]),
)

export const testSchema = createJsonRpcRequestSchema(
  'pm_getSupportedChains',
  z.tuple([userOperationSchema, addressSchema]),
)

export type PmSponsorUserOperationRequest = z.infer<
  typeof pmSponsorUserOperationRequestSchema
>

export const supportedPaymasterRequestSchema = z.discriminatedUnion('method', [
  pmSponsorUserOperationRequestSchema,
  testSchema,
])

export type SupportedPaymasterRequest = z.infer<
  typeof supportedPaymasterRequestSchema
>
