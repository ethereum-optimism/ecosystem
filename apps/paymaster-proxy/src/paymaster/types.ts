import type { Address, Chain, Hex } from 'viem'

import type {
  PaymasterNonRpcError,
  PaymasterRpcError,
} from '@/errors/PaymasterError'
import type { UserOperation } from '@/schemas/userOperationSchema'

export type PaymasterResponse<T> =
  | {
      success: true
      result: T
    }
  | {
      success: false
      error: PaymasterNonRpcError | PaymasterRpcError
    }

// Should not throw, but return a result or an error
export type SponsorUserOperationImpl = (
  userOperation: UserOperation,
  entryPoint: Address,
) => Promise<
  PaymasterResponse<{
    paymasterAndData: Hex
    callGasLimit: Hex
    verificationGasLimit: Hex
    preVerificationGas: Hex
  }>
>

export type PaymasterConfig<T extends Chain = Chain> = {
  chain: T
  sponsorUserOperation: SponsorUserOperationImpl
}
