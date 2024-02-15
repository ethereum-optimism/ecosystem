import type * as Express from 'express'

import { processSingleOrMultiple } from '@/helpers/processSingleOrMultiple'
import type { SponsorUserOperationImpl } from '@/paymaster/types'
import { handleValidatedPaymasterRequest } from '@/rpc/handleValidatedPaymasterRequest'
import { validateJsonRpcRequest } from '@/rpc/validateJsonRpcRequest'

export const getJsonRpcRequestHandler =
  ({
    sponsorUserOperation,
  }: {
    sponsorUserOperation: SponsorUserOperationImpl
  }) =>
  async (req: Express.Request, res: Express.Response) => {
    const result = await processSingleOrMultiple(
      req.body,
      async (jsonRpcRequest: unknown) => {
        // Basic validation to check that request is valid and that it is a supported method
        const validationResult = validateJsonRpcRequest(jsonRpcRequest)

        if (validationResult.success === false) {
          return validationResult.error.response()
        }

        // Send transaction to paymaster RPC and return result
        return await handleValidatedPaymasterRequest(
          validationResult.data,
          sponsorUserOperation,
        )
      },
    )

    return res.json(result)
  }
