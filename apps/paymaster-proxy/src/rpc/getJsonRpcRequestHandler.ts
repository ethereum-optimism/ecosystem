import type * as Express from 'express'

import { JsonRpcError } from '@/errors/JsonRpcError'
import { PaymasterNonRpcError } from '@/errors/PaymasterError'
import { processSingleOrMultiple } from '@/helpers/processSingleOrMultiple'
import { screenAddress } from '@/helpers/screenAddress'
import type {
  DefaultMetricsNamespaceLabels,
  Metrics,
} from '@/monitoring/metrics'
import type {
  PaymasterResponse,
  SponsorUserOperationImpl,
} from '@/paymaster/types'
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

const logMetricsForPaymasterRpcCall = ({
  paymasterResponse,
  metrics,
  defaultMetricLabels,
}: {
  paymasterResponse: PaymasterResponse<any>
  metrics: Metrics
  defaultMetricLabels: DefaultMetricsNamespaceLabels
}) => {
  if (paymasterResponse.success) {
    return metrics.paymasterCallSuccesses.inc(defaultMetricLabels)
  }

  if (paymasterResponse.error instanceof PaymasterNonRpcError) {
    return metrics.paymasterCallNonRpcFailures.inc(defaultMetricLabels)
  }
  return metrics.paymasterCallRpcFailures.inc({
    ...defaultMetricLabels,
    jsonRpcCode: paymasterResponse.error.code,
  })
}

export const getJsonRpcRequestHandler =
  ({
    sponsorUserOperation,
    metrics,
    defaultMetricLabels,
  }: {
    sponsorUserOperation: SponsorUserOperationImpl
    metrics: Metrics
    defaultMetricLabels: DefaultMetricsNamespaceLabels
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
            metrics.screeningServiceCallFailures.inc(defaultMetricLabels)
            return JsonRpcError.internalError({
              id: paymasterRequest.id,
            }).response()
          }

          if (isAddressSanctioned) {
            metrics.sanctionedAddressBlocked.inc(defaultMetricLabels)
            return JsonRpcError.internalErrorSanctionedAddress({
              id: paymasterRequest.id,
            }).response()
          }

          // Send transaction to paymaster RPC and return result
          const handlePaymasterRequestResult = await handlePaymasterMethod(
            validationResult.data,
            sponsorUserOperation,
          )

          logMetricsForPaymasterRpcCall({
            paymasterResponse: handlePaymasterRequestResult,
            metrics,
            defaultMetricLabels,
          })

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
