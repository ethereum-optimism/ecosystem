import { createAlchemyPublicRpcClient } from '@alchemy/aa-alchemy'
import type { Address, Chain, HttpRequestError } from 'viem'
import { z } from 'zod'

import {
  PaymasterNonRpcError,
  PaymasterRpcError,
} from '@/errors/PaymasterError'
import type { PaymasterConfig } from '@/paymaster/types'
import { createJsonStringSchema } from '@/schemas/createJsonStringSchema'
import type { UserOperation } from '@/schemas/userOperationSchema'

const alchemyJsonRpcHttpRequestErrorDetailsSchema = createJsonStringSchema(
  z.object({
    code: z.number(),
    message: z.string(),
  }),
)

const isHttpRequestError = (e: unknown): e is HttpRequestError => {
  return (e as any).name === 'HttpRequestError'
}

export const getAlchemyPaymasterConfig = <T extends Chain>({
  chain,
  rpcUrl,
  policyId,
}: {
  chain: T
  rpcUrl: string
  policyId: string
}): PaymasterConfig<T> => {
  const client = createAlchemyPublicRpcClient({
    connectionConfig: {
      rpcUrl,
    },
    chain,
  })
  return {
    chain,
    sponsorUserOperation: async (
      userOperation: UserOperation,
      entryPoint: Address,
    ) => {
      const {
        sender,
        nonce,
        initCode,
        callData,
        signature,
        callGasLimit,
        verificationGasLimit,
        preVerificationGas,
        maxFeePerGas,
        maxPriorityFeePerGas,
      } = userOperation

      try {
        const response = await client.request({
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
              overrides: {
                callGasLimit,
                verificationGasLimit,
                preVerificationGas,
                maxFeePerGas,
                maxPriorityFeePerGas,
              },
            },
          ],
        })

        return {
          success: true as const,
          result: {
            paymasterAndData: response.paymasterAndData,
            callGasLimit: response.callGasLimit,
            verificationGasLimit: response.verificationGasLimit,
            preVerificationGas: response.preVerificationGas,
            maxFeePerGas: response.maxFeePerGas,
            maxPriorityFeePerGas: response.maxPriorityFeePerGas,
          },
        }
      } catch (e: unknown) {
        // Alchemy returns a HttpRequestError when the RPC call fails
        if (isHttpRequestError(e)) {
          const detailsParse =
            alchemyJsonRpcHttpRequestErrorDetailsSchema.safeParse(e.details)

          if (detailsParse.success) {
            return {
              success: false as const,
              error: new PaymasterRpcError(
                detailsParse.data.code as number,
                detailsParse.data.message,
              ),
            }
          }
        }

        // Return generic error if we can't parse the error details
        return {
          success: false as const,
          error: PaymasterNonRpcError.fromError(e as Error),
        }
      }
    },
  }
}
