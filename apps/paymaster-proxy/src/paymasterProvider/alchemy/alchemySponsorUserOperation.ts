import type { ClientWithAlchemyMethods } from '@alchemy/aa-alchemy'
import type { Address, HttpRequestError } from 'viem'
import { z } from 'zod'

import { AlchemySponsorUserOperationProxiedError } from '@/paymasterProvider/alchemy/AlchemySponsorUserOperationProxiedError'
import { createJsonStringSchema } from '@/schemas/createJsonStringSchema'
import type { UserOperation } from '@/schemas/userOperationSchema'

const isHttpRequestError = (e: unknown): e is HttpRequestError => {
  return (e as any).name === 'HttpRequestError'
}

const alchemyJsonRpcHttpRequestErrorDetailsSchema = createJsonStringSchema(
  z.object({
    code: z.number(),
    message: z.string(),
  }),
)

export const alchemySponsorUserOperation = async (
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
    const response = await alchemyClient.request({
      method: 'alchemy_requestGasAndPaymasterAndData',
      params: [
        {
          policyId,
          entryPoint,
          // Types on the SDK don't seem to match docs https://docs.alchemy.com/reference/alchemy-requestgasandpaymasteranddata
          // SDK types expects userOperation to be fully filled out, but docs say only sender, nonce, initCode and callData are required
          // Lying to Typescript that all fields existing so we can get benefits of the typed response
          userOperation: {
            sender,
            nonce,
            initCode,
            callData,
          } as Required<UserOperation>,
          dummySignature: signature,
          // Consistent with Pimlico and Stackup paymaster behavior, we ignore any overrides to gas estimation params (callGasLimit, verificationGasLimit, preVerificationGas)
          overrides: {
            maxFeePerGas,
            maxPriorityFeePerGas,
          },
        },
      ],
    })

    return {
      paymasterAndData: response.paymasterAndData,
      callGasLimit: response.callGasLimit,
      verificationGasLimit: response.verificationGasLimit,
      preVerificationGas: response.preVerificationGas,
      maxFeePerGas: response.maxFeePerGas,
      maxPriorityFeePerGas: response.maxPriorityFeePerGas,
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
