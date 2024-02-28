import {
  BundlerClient,
  ClientMiddlewareConfig,
  Hex,
  HttpTransport,
  UserOperationFeeOptions,
  UserOperationRequest,
  deepHexlify,
  defaultFeeEstimator,
  defaultGasEstimator,
  filterUndefined,
  isBigNumberish,
  resolveProperties,
} from '@alchemy/aa-core'
import { fromHex } from 'viem'

// Based off of `alchemyGasManagerMiddleware`
// Since paymaster call also returns gas estimations, no need to estimate in the gasEstimator
export const superchainPaymasterMiddleware = <
  C extends BundlerClient<HttpTransport>,
>(
  client: C,
): Pick<
  ClientMiddlewareConfig,
  'paymasterAndData' | 'feeEstimator' | 'gasEstimator'
> => {
  return {
    gasEstimator: async (struct, { overrides, account, feeOptions }) => {
      const zeroEstimates = {
        callGasLimit: 0n,
        preVerificationGas: 0n,
        verificationGasLimit: 0n,
      }

      const fallbackGasEstimator = defaultGasEstimator(client)

      if (overrides?.paymasterAndData) {
        return {
          ...struct,
          ...zeroEstimates,
          ...fallbackGasEstimator(struct, {
            overrides,
            account,
            feeOptions,
          }),
        }
      }

      return {
        ...struct,
        callGasLimit: 0n,
        preVerificationGas: 0n,
        verificationGasLimit: 0n,
      }
    },

    feeEstimator: async (struct, { overrides, account, feeOptions }) => {
      let maxFeePerGas = (await struct.maxFeePerGas) ?? 0n
      let maxPriorityFeePerGas = (await struct.maxPriorityFeePerGas) ?? 0n

      const fallbackFeeEstimator = defaultFeeEstimator(client)

      // but if user is bypassing paymaster to fallback to having the account to pay the gas (one-off override),
      // we cannot delegate gas estimation to the bundler because paymaster middleware will not be called
      if (overrides?.paymasterAndData === '0x') {
        const result = await fallbackFeeEstimator(struct, {
          overrides,
          feeOptions,
          account,
        })
        maxFeePerGas = (await result.maxFeePerGas) ?? maxFeePerGas
        maxPriorityFeePerGas =
          (await result.maxPriorityFeePerGas) ?? maxPriorityFeePerGas
      }

      return {
        ...struct,
        maxFeePerGas,
        maxPriorityFeePerGas,
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

        const result = await client.request({
          method: 'pm_sponsorUserOperation',
          params: [userOperationWithOverrides, account.getEntryPoint().address],
        })

        return {
          ...struct,
          ...result,
        }
      },
      dummyPaymasterAndData: () => '0x',
    },
  }
}
