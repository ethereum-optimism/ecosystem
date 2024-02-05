import { Address as addressSchema } from 'abitype/zod'
import { z } from 'zod'

import { createJsonRpcRequestSchema } from '@/helpers/createJsonRpcRequestSchema'
import { userOperationSchema } from '@/schemas/userOperationSchema'

export const pmSponsorUserOperationRequestParamsSchema =
  createJsonRpcRequestSchema(
    z.literal('pm_sponsorUserOperation'),
    z.tuple([userOperationSchema, addressSchema]),
  )
