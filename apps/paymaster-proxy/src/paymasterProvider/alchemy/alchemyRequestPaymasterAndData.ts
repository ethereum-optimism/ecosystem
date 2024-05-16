import type {
  ClientWithAlchemyMethods,
  RequestPaymasterAndDataResponse,
} from '@alchemy/aa-alchemy'
import type { Address } from 'viem'

import {
  alchemyJsonRpcHttpRequestErrorDetailsSchema,
  AlchemySponsorUserOperationProxiedError,
  isHttpRequestError,
} from '@/paymasterProvider/alchemy/alchemyErrors'
import type { UserOperation } from '@/schemas/userOperationSchema'

export const alchemyRequestPaymasterAndData = async (
  alchemyClient: ClientWithAlchemyMethods,
  policyId: string,
  userOperation: UserOperation,
  entryPoint: Address,
) => {
  const {
    sender,
    nonce,
    initCode,
    callData,
    signature,
    maxFeePerGas,
    maxPriorityFeePerGas,
  } = userOperation

  try {
    const response = (await alchemyClient.request({
      method: 'alchemy_requestPaymasterAndData',
      params: [
        {
          policyId,
          entryPoint,
          userOperation: {
            sender,
            nonce,
            initCode,
            callData,
            signature,
            maxFeePerGas,
            maxPriorityFeePerGas,
          } as Required<UserOperation>,
        },
      ],
    })) as RequestPaymasterAndDataResponse<'0.6.0'>

    return {
      paymasterAndData: response.paymasterAndData,
    }
  } catch (e: unknown) {
    // Alchemy returns a HttpRequestError when the RPC call fails
    if (!isHttpRequestError(e)) {
      // rethrow any unexpected errors
      throw e
    }

    const alchemyRpcError = alchemyJsonRpcHttpRequestErrorDetailsSchema.parse(
      e.details,
    )

    // proxy the code / message returned by Alchemy
    throw new AlchemySponsorUserOperationProxiedError(
      alchemyRpcError.code,
      alchemyRpcError.message,
      policyId,
    )
  }
}
