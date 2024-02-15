import { JsonRpcError } from '@/errors/JsonRpcError'
import { PaymasterRpcError } from '@/errors/PaymasterError'
import type { SponsorUserOperationImpl } from '@/paymaster/types'
import { getJsonRpcResponse } from '@/rpc/getJsonRpcResponse'
import type { SupportedPaymasterRequest } from '@/schemas/supportedPaymasterRequestSchema'

export const handleValidatedPaymasterRequest = async (
  request: SupportedPaymasterRequest,
  sponsorUserOperation: SponsorUserOperationImpl,
) => {
  switch (request.method) {
    case 'pm_sponsorUserOperation': {
      const { params, id } = request
      const [userOp, entryPoint] = params
      const sponsorUserOpResult = await sponsorUserOperation(userOp, entryPoint)

      if (sponsorUserOpResult.success === false) {
        if (sponsorUserOpResult.error instanceof PaymasterRpcError) {
          // TODO: also filter out some non relevant errors
          return JsonRpcError.fromPaymasterRpcError(
            sponsorUserOpResult.error,
            id,
          ).response()
        }

        // A generic internal error
        return JsonRpcError.internalError({ id }).response()
      }

      return getJsonRpcResponse(id, sponsorUserOpResult.result)
    }
  }
}
