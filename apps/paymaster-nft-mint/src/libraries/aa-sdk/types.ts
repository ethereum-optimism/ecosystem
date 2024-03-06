import { Hex, UserOperationRequest } from '@alchemy/aa-core'
import { Address, Chain, Client, Transport } from 'viem'

export type PmSponsorUserOperationReturnType = {
  paymasterAndData: Hex
  callGasLimit: Hex
  verificationGasLimit: Hex
  preVerificationGas: Hex
  maxFeePerGas: Hex
  maxPriorityFeePerGas: Hex
}

export type SuperchainPaymasterClient<
  T extends Transport = Transport,
  C extends Chain = Chain,
> = Client<
  T,
  C,
  undefined,
  [
    {
      Method: 'pm_sponsorUserOperation'
      Parameters: [UserOperationRequest, Address]
      ReturnType: PmSponsorUserOperationReturnType
    },
  ],
  {
    sponsorUserOperation: (
      request: UserOperationRequest,
      entryPoint: Address,
    ) => Promise<PmSponsorUserOperationReturnType>
  }
>
