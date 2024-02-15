import type * as Express from 'express'

import { processSingleOrMultiple } from '@/helpers/processSingleOrMultiple'
import type { SponsorUserOperationImpl } from '@/paymaster/types'
import { validateJsonRpcRequest } from '@/rpc/validateJsonRpcRequest'
import { wrapPaymasterResponseIntoJsonRpcResponse } from '@/rpc/wrapPaymasterResponseIntoJsonRpcResponse'
import type { SupportedPaymasterRequest } from '@/schemas/supportedPaymasterRequestSchema'

const handlePaymasterMethod = async <
  T extends SupportedPaymasterRequest = SupportedPaymasterRequest,
>(
  request: T,
  sponsorUserOperation: SponsorUserOperationImpl,
) => {
  switch (request.method) {
    case 'pm_sponsorUserOperation': {
      const [userOp, entryPoint] = request.params
      return await sponsorUserOperation(userOp, entryPoint)
    }
  }
}

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
        const handlePaymasterRequestResult = await handlePaymasterMethod(
          validationResult.data,
          sponsorUserOperation,
        )

        return wrapPaymasterResponseIntoJsonRpcResponse(
          handlePaymasterRequestResult,
          validationResult.data.id,
        )
      },
    )

    return res.json(result)
  }
