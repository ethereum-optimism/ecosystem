import { createSuperchainPaymasterClient } from '@/libraries/aa-sdk/createSuperchainPaymasterClient'
import {
  ClientMiddlewareConfig,
  Hex,
  UserOperationFeeOptions,
  UserOperationRequest,
  deepHexlify,
  filterUndefined,
  isBigNumberish,
  resolveProperties,
} from '@alchemy/aa-core'
import { Chain, fromHex } from 'viem'

// Based off of `alchemyGasManagerMiddleware`
// https://github.com/alchemyplatform/aa-sdk/blob/0802327e496d0d71f3f069262527855707d3fac3/packages/alchemy/src/middleware/gasManager.ts#L54
// Passes off all gas/fee estimation to the Paymaster RPC call
export const superchainPaymasterMiddleware = ({
  paymasterRpcUrl,
  chain,
}: {
  paymasterRpcUrl: string
  chain: Chain
}): Pick<
  ClientMiddlewareConfig,
  'paymasterAndData' | 'feeEstimator' | 'gasEstimator'
> => {
  const paymasterClient = createSuperchainPaymasterClient({
    paymasterRpcUrl,
    chain,
  })
  return {
    // Since paymaster call also returns gas estimations, no need to estimate in the gasEstimator
    gasEstimator: async (struct) => {
      return {
        ...struct,
        callGasLimit: 0n,
        preVerificationGas: 0n,
        verificationGasLimit: 0n,
      }
    },

    //  Since paymaster call also returns fee estimations, no need to estimate in the feeEstimator
    feeEstimator: async (struct) => {
      return {
        ...struct,
        maxFeePerGas: 0n,
        maxPriorityFeePerGas: 0n,
      }
    },
    paymasterAndData: {
      paymasterAndData: async (struct, { overrides, account }) => {
        const userOperation: UserOperationRequest = deepHexlify(
          await resolveProperties(struct),
        )

        const overrideField = (
          field: keyof UserOperationFeeOptions,
        ): Hex | undefined => {
          if (overrides?.[field] != null) {
            // one-off absolute override
            if (isBigNumberish(overrides[field])) {
              return deepHexlify(overrides[field])
            }
          }
          if (fromHex(userOperation[field], 'bigint') > 0n) {
            return userOperation[field]
          }

          return undefined
        }

        const userOperationWithOverrides = filterUndefined({
          ...userOperation,
          maxFeePerGas: overrideField('maxFeePerGas'),
          maxPriorityFeePerGas: overrideField('maxPriorityFeePerGas'),
          callGasLimit: overrideField('callGasLimit'),
          verificationGasLimit: overrideField('verificationGasLimit'),
          preVerificationGas: overrideField('preVerificationGas'),
        })

        const paymasterSponsorUserOperationResult =
          await paymasterClient.sponsorUserOperation(
            userOperationWithOverrides as unknown as UserOperationRequest,
            account.getEntryPoint().address,
          )

        return {
          ...struct,
          ...paymasterSponsorUserOperationResult,
        }
      },
      dummyPaymasterAndData: () => '0x',
    },
  }
}
