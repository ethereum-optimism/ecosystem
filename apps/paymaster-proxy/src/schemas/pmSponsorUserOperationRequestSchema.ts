import { z } from 'zod'

import { createJsonRpcRequestSchema } from '@/helpers/createJsonRpcRequestSchema'

export const pmSponsorUserOperationRequestSchema = createJsonRpcRequestSchema(
  z.literal('pm_sponsorUserOperation'),
  z.tuple([z.str]),
)
