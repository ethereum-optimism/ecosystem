import { createAlchemyPublicRpcClient } from '@alchemy/aa-alchemy'
import type { Address, Chain } from 'viem'
import { RpcRequestError } from 'viem'

import {
  PaymasterNonRpcError,
  PaymasterRpcError,
} from '@/errors/PaymasterError'
import type { PaymasterConfig } from '@/paymaster/types'
import type { UserOperation } from '@/schemas/userOperationSchema'

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
      try {
        const response = await client.request({
          method: 'alchemy_requestGasAndPaymasterAndData',
          params: [
            {
              policyId,
              entryPoint,
              userOperation,
              dummySignature: userOperation.signature,
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
          },
        }
      } catch (e: unknown) {
        if (e instanceof RpcRequestError) {
          return {
            success: false as const,
            error: PaymasterRpcError.fromViemRpcRequestError(e),
          }
        }
        return {
          success: false as const,
          error: PaymasterNonRpcError.fromError(e as Error),
        }
      }
    },
  }
}
