import type {
  Account,
  Address,
  Chain,
  Client,
  ContractFunctionReturnType,
  DeriveChain,
  EstimateContractGasErrorType,
  EstimateContractGasParameters,
  Hash,
  Hex,
  SimulateContractParameters,
  Transport,
  WriteContractErrorType,
} from 'viem'
import { estimateContractGas, simulateContract } from 'viem/actions'

import { l2ToL2CrossDomainMessengerABI } from '@/abis.js'
import { contracts } from '@/contracts.js'
import type { BaseWriteContractActionParameters } from '@/core/baseWriteAction.js'
import { baseWriteAction } from '@/core/baseWriteAction.js'
import type { ErrorType } from '@/types/utils.js'

export type SendL2ToL2MessageParameters<
  TChain extends Chain | undefined = Chain | undefined,
  TAccount extends Account | undefined = Account | undefined,
  TChainOverride extends Chain | undefined = Chain | undefined,
  TDerivedChain extends Chain | undefined = DeriveChain<TChain, TChainOverride>,
> = BaseWriteContractActionParameters<
  TChain,
  TAccount,
  TChainOverride,
  TDerivedChain
> & {
  /** Chain ID of the destination chain. */
  destinationChainId: number
  /** Target contract or wallet address. */
  target: Address
  /** Message payload to call target with. */
  message: Hex
}
export type SendL2ToL2MessageReturnType = Hash
export type SendL2ToL2MessageContractReturnType = ContractFunctionReturnType<
  typeof l2ToL2CrossDomainMessengerABI,
  'nonpayable',
  'sendMessage'
>
export type SendL2ToL2MessageErrorType =
  | EstimateContractGasErrorType
  | WriteContractErrorType
  | ErrorType

/**
 * Initiates the intent of sending a L2 to L2 message. Used in the interop flow.
 *
 * - Docs: TODO add markdown docs
 * @param client - Client to use
 * @param parameters - {@link SendL2ToL2MessageParameters}
 * @returns The sendL2ToL2Message transaction hash. {@link SendL2ToL2MessageReturnType}
 * @example
 * import { createWalletClient, http } from 'viem'
 * import { optimism } from 'viem/chains'
 * import { sendL2ToL2Message } from '@eth-optimism/viem'
 *
 * const walletClientL1 = createWalletClient({
 *   chain: optimism,
 *   transport: http(),
 * })
 *
 * const request = await sendL2ToL2Message(walletClientL1, {
 *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 *   targetChain: optimism,
 *   destinationChainId: 8453,
 *   target: 0x...,
 *   message: 0x...,
 * })
 */
export async function sendL2ToL2Message<
  chain extends Chain | undefined,
  account extends Account | undefined,
  chainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: SendL2ToL2MessageParameters<chain, account, chainOverride>,
): Promise<SendL2ToL2MessageReturnType> {
  const { destinationChainId, target, message, ...txParameters } = parameters

  return baseWriteAction(
    client,
    {
      abi: l2ToL2CrossDomainMessengerABI,
      contractAddress: contracts.l2ToL2CrossDomainMessenger.address,
      contractFunctionName: 'sendMessage',
      contractArgs: [destinationChainId, target, message],
    },
    txParameters as BaseWriteContractActionParameters,
  )
}

export async function estimateSendL2ToL2MessageGas<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
  TChainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, TChain, TAccount>,
  parameters: SendL2ToL2MessageParameters<TChain, TAccount, TChainOverride>,
): Promise<bigint> {
  const { destinationChainId, target, message, ...txParameters } = parameters

  return estimateContractGas(client, {
    abi: l2ToL2CrossDomainMessengerABI,
    address: contracts.l2ToL2CrossDomainMessenger.address,
    functionName: 'sendMessage',
    args: [destinationChainId, target, message],
    ...txParameters,
  } as EstimateContractGasParameters)
}

export async function simulateSendL2ToL2Message<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
  TChainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, TChain, TAccount>,
  parameters: SendL2ToL2MessageParameters<TChain, TAccount, TChainOverride>,
): Promise<SendL2ToL2MessageContractReturnType> {
  const { account, destinationChainId, target, message } = parameters

  const res = await simulateContract(client, {
    account,
    abi: l2ToL2CrossDomainMessengerABI,
    address: contracts.l2ToL2CrossDomainMessenger.address,
    chain: client.chain,
    functionName: 'sendMessage',
    args: [destinationChainId, target, message],
  } as SimulateContractParameters)

  return res.result as SendL2ToL2MessageContractReturnType
}
