import { Address as addressSchema } from 'abitype/zod'
import { z } from 'zod'

import { createJsonRpcRequestSchema } from '@/schemas/createJsonRpcRequestSchema'
import { userOperationSchema } from '@/schemas/userOperationSchema'

export const pmSponsorUserOperationRequestSchema = createJsonRpcRequestSchema(
  z.literal('pm_sponsorUserOperation'),
  z.tuple([userOperationSchema, addressSchema]),
)

export const supportedPaymasterRequestSchema = z.discriminatedUnion('method', [
  pmSponsorUserOperationRequestSchema,
])

export type SupportedPaymasterRequest = z.infer<
  typeof supportedPaymasterRequestSchema
>
