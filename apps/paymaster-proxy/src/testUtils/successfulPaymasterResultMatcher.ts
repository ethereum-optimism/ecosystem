import { expect } from 'vitest'

export const successfulPaymasterResultMatcher = {
  paymasterAndData: expect.toBeNonNullHex(),
  callGasLimit: expect.toBeNonNullHex(),
  verificationGasLimit: expect.toBeNonNullHex(),
  preVerificationGas: expect.toBeNonNullHex(),
  maxFeePerGas: expect.toBeNonNullHex(),
  maxPriorityFeePerGas: expect.toBeNonNullHex(),
}
