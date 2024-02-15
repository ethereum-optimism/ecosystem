import { JsonRpcError } from '@/errors/JsonRpcError'
import { PaymasterRpcError } from '@/errors/PaymasterError'
import type { PaymasterResponse } from '@/paymaster/types'

export const wrapPaymasterResponseIntoJsonRpcResponse = <T>(
  response: PaymasterResponse<T>,
  id: number,
) => {
  if (response.success === false) {
    // Pass the RPC error to the user so it can be used for debugging
    if (response.error instanceof PaymasterRpcError) {
      return JsonRpcError.fromPaymasterRpcError(response.error, id).response()
    }

    // A generic internal error, no need to pass this on to the user
    return JsonRpcError.internalError({ id }).response()
  }

  return {
    jsonrpc: '2.0' as const,
    id,
    result: response,
  }
}
