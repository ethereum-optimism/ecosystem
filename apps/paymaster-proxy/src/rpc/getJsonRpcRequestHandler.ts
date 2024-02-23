import type * as Express from 'express'

import { JsonRpcError } from '@/errors/JsonRpcError'
import { processSingleOrMultiple } from '@/helpers/processSingleOrMultiple'
import { screenAddress } from '@/helpers/screenAddress'
import type { Metrics } from '@/monitoring/metrics'
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
  if (request.method === 'pm_sponsorUserOperation') {
    const [userOp, entryPoint] = request.params
    return await sponsorUserOperation(userOp, entryPoint)
  }
  throw new Error('Unsupported method') // should not happen
}

export const getJsonRpcRequestHandler =
  ({
    sponsorUserOperation,
    metrics,
  }: {
    sponsorUserOperation: SponsorUserOperationImpl
    metrics: Metrics
  }) =>
  async (req: Express.Request, res: Express.Response) => {
    try {
      const result = await processSingleOrMultiple(
        req.body,
        async (jsonRpcRequest: unknown) => {
          // Basic validation to check that request is valid and that it is a supported method
          const validationResult = validateJsonRpcRequest(jsonRpcRequest)

          if (!validationResult.success) {
            return validationResult.error.response()
          }

          const paymasterRequest = validationResult.data

          let isAddressSanctioned = false
          try {
            isAddressSanctioned = await screenAddress(
              paymasterRequest.params[0].sender,
            )
          } catch (e) {
            metrics.screeningServiceCallFailures.inc({ chainId: 1 })
            return JsonRpcError.internalError({
              id: paymasterRequest.id,
            }).response()
          }

          if (isAddressSanctioned) {
            metrics.sanctionedAddressBlocked.inc({ chainId: 1 })
            return JsonRpcError.internalErrorSanctionedAddress({
              id: paymasterRequest.id,
            }).response()
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
    } catch (e) {
      res.status(500).send()
    }
  }
