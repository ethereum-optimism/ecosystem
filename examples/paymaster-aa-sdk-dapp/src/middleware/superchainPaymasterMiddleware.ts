import {
  BundlerClient,
  ClientMiddlewareConfig,
  HttpTransport,
  defaultFeeEstimator,
  defaultGasEstimator,
} from '@alchemy/aa-core'

// Based off of `alchemyGasManagerMiddleware`
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
    paymasterAndData: async () => {},
  }
}
