import type * as Express from 'express'
import type { Logger } from 'pino'

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

const logPaymasterRpcCallResponse = ({
  paymasterResponse,
  metrics,
  defaultMetricLabels,
  logger,
}: {
  paymasterResponse: PaymasterResponse<any>
  metrics: Metrics
  defaultMetricLabels: DefaultMetricsNamespaceLabels
  logger: Logger
}) => {
  if (paymasterResponse.success) {
    return metrics.paymasterCallSuccesses.inc(defaultMetricLabels)
  }

  if (paymasterResponse.error instanceof PaymasterNonRpcError) {
    logger.error(
      paymasterResponse.error.underlyingError?.message,
      'Paymaster non-RPC error',
    )
    metrics.paymasterCallNonRpcFailures.inc(defaultMetricLabels)
    return
  }
  metrics.paymasterCallRpcFailures.inc({
    ...defaultMetricLabels,
    jsonRpcCode: paymasterResponse.error.code,
  })
  return
}

export const getJsonRpcRequestHandler =
  ({
    sponsorUserOperation,
    logger,
    metrics,
    defaultMetricLabels,
  }: {
    sponsorUserOperation: SponsorUserOperationImpl
    logger: Logger
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
            logger.error({
              message: 'Error while screening address',
              error: e,
              address: paymasterRequest.params[0].sender,
            })
            return JsonRpcError.internalError({
              id: paymasterRequest.id,
            }).response()
          }

          if (isAddressSanctioned) {
            metrics.sanctionedAddressBlocked.inc(defaultMetricLabels)
            logger.info({
              message: 'Screened address',
              address: paymasterRequest.params[0].sender,
            })
            return JsonRpcError.internalErrorSanctionedAddress({
              id: paymasterRequest.id,
            }).response()
          }

          // Send transaction to paymaster RPC and return result
          const handlePaymasterRequestResult = await handlePaymasterMethod(
            validationResult.data,
            sponsorUserOperation,
          )

          logPaymasterRpcCallResponse({
            paymasterResponse: handlePaymasterRequestResult,
            metrics,
            defaultMetricLabels,
            logger,
          })

          return wrapPaymasterResponseIntoJsonRpcResponse(
            handlePaymasterRequestResult,
            validationResult.data.id,
          )
        },
      )
      return res.json(result)
    } catch (e) {
      logger.error(e, 'Unhandled error in JSON-RPC request handler')
      res.status(500).send()
    }
  }
