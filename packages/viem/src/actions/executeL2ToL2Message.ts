import type {
  Account,
  Address,
  Chain,
  Client,
  DeriveChain,
  EstimateContractGasParameters,
  Hash,
  Hex,
  SimulateContractParameters,
  Transport,
  WriteContractErrorType,
} from 'viem'
import { estimateContractGas, simulateContract } from 'viem/actions'

import { crossL2InboxABI } from '@/abis.js'
import type { EstimateExecuteL2ToL2MessageGasErrorType } from '@/actions/estimateExecuteL2ToL2MessageGas.js'
import { contracts } from '@/contracts.js'
import {
  baseWriteAction,
  type BaseWriteContractActionParameters,
} from '@/core/baseWriteAction.js'
import type { MessageIdentifier } from '@/types/interop.js'
import type { ErrorType } from '@/types/utils.js'

export type ExecuteL2ToL2MessageParameters<
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
  chainOverride extends Chain | undefined = Chain | undefined,
  derivedChain extends Chain | undefined = DeriveChain<chain, chainOverride>,
> = BaseWriteContractActionParameters<
  chain,
  account,
  chainOverride,
  derivedChain
> & {
  /** Identifier pointing to the initiating message. */
  id: MessageIdentifier
  /** Target contract or wallet address. */
  target: Address
  /** Message payload to call target with. */
  message: Hex
}
export type ExecuteL2ToL2MessageReturnType = Hash
export type ExecuteL2ToL2MessageErrorType =
  | EstimateExecuteL2ToL2MessageGasErrorType
  | WriteContractErrorType
  | ErrorType

/**
 * Executes the L2 to L2 message. Used in the interop flow.
 *
 * - Docs: TODO add markdown docs
 * @param client - Client to use
 * @param parameters - {@link ExecuteL2ToL2MessageParameters}
 * @returns The executeL2ToL2Message transaction hash. {@link ExecuteL2ToL2MessageReturnType}
 * @example
 * import { createWalletClient, http } from 'viem'
 * import { optimism } from 'viem/chains'
 * import { executeL2ToL2Message } from '@eth-optimism/viem'
 *
 * const walletClientL1 = createWalletClient({
 *   chain: optimism,
 *   transport: http(),
 * })
 *
 * const request = await executeL2ToL2Message(walletClientL1, {
 *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 *   targetChain: optimism,
 *   id: { ... },
 *   target: 0x...,
 *   message: 0x...,
 * })
 */
export async function executeL2ToL2Message<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
  TChainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, TChain, TAccount>,
  parameters: ExecuteL2ToL2MessageParameters<TChain, TAccount, TChainOverride>,
): Promise<ExecuteL2ToL2MessageReturnType> {
  const { id, target, message, ...txParameters } = parameters

  return baseWriteAction(
    client,
    {
      abi: crossL2InboxABI,
      contractAddress: contracts.crossL2Inbox.address,
      contractFunctionName: 'executeMessage',
      contractArgs: [id, target, message],
    },
    txParameters as BaseWriteContractActionParameters,
  )
}

export async function estimateExecuteL2ToL2MessageGas<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
  TChainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, TChain, TAccount>,
  parameters: ExecuteL2ToL2MessageParameters<TChain, TAccount, TChainOverride>,
): Promise<bigint> {
  const { id, target, message, ...txParameters } = parameters

  return estimateContractGas(client, {
    abi: crossL2InboxABI,
    address: contracts.crossL2Inbox.address,
    functionName: 'executeMessage',
    args: [id, target, message],
    ...txParameters,
  } as EstimateContractGasParameters)
}

export async function simulateExecuteL2ToL2Message<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
  TChainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, TChain, TAccount>,
  parameters: ExecuteL2ToL2MessageParameters<TChain, TAccount, TChainOverride>,
) {
  const { account, id, target, message } = parameters

  return simulateContract(client, {
    account,
    abi: crossL2InboxABI,
    address: contracts.crossL2Inbox.address,
    chain: client.chain,
    functionName: 'executeMessage',
    args: [id, target, message],
  } as SimulateContractParameters)
}
