import type {
  Account,
  Chain,
  Client,
  ContractFunctionReturnType,
  DeriveChain,
  EstimateContractGasErrorType,
  EstimateContractGasParameters,
  Hash,
  SimulateContractParameters,
  Transport,
  WriteContractErrorType,
} from 'viem'
import { estimateContractGas, simulateContract } from 'viem/actions'

import { l2ToL2CrossDomainMessengerAbi } from '@/abis.js'
import { contracts } from '@/contracts.js'
import {
  baseWriteAction,
  type BaseWriteContractActionParameters,
} from '@/core/baseWriteAction.js'
import type { MessageIdentifier, MessagePayload } from '@/types/interop.js'
import type { ErrorType } from '@/types/utils.js'

/**
 * @category Types
 */
export type RelayL2ToL2MessageParameters<
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
  /** Identifier pointing to the sent message. */
  sentMessageId: MessageIdentifier
  /** MessagePayload of the SentMessage event **/
  sentMessagePayload: MessagePayload
}

/**
 * @category Types
 */
export type RelayL2ToL2MessageReturnType = Hash

/**
 * @category Types
 */
export type RelayL2ToL2MessageContractReturnType = ContractFunctionReturnType<
  typeof l2ToL2CrossDomainMessengerAbi,
  'payable',
  'relayMessage'
>

/**
 * @category Types
 */
export type RelayL2ToL2MessageErrorType =
  | EstimateContractGasErrorType
  | WriteContractErrorType
  | ErrorType

/**
 * Relays a message emitted by the L2ToL2CrossDomainMessenger
 * @category L2 Wallet Actions
 * @param client - Client to use
 * @param parameters - {@link RelayL2ToL2MessageParameters}
 * @returns The relayMessage transaction hash. {@link RelayL2ToL2MessageReturnType}
 */
export async function relayL2ToL2Message<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
  TChainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, TChain, TAccount>,
  parameters: RelayL2ToL2MessageParameters<TChain, TAccount, TChainOverride>,
): Promise<RelayL2ToL2MessageReturnType> {
  const { sentMessageId, sentMessagePayload, ...txParameters } = parameters

  return baseWriteAction(
    client,
    {
      abi: l2ToL2CrossDomainMessengerAbi,
      contractAddress: contracts.l2ToL2CrossDomainMessenger.address,
      contractFunctionName: 'relayMessage',
      contractArgs: [sentMessageId, sentMessagePayload],
    },
    txParameters as BaseWriteContractActionParameters,
  )
}

/**
 * Estimates gas for {@link relayL2ToL2Message}
 * @category L2 Wallet Actions
 * @param client - Client to use
 * @param parameters - {@link RelayL2ToL2MessageParameters}
 * @returns The estimated gas value.
 */
export async function estimateRelayL2ToL2MessageGas<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
  TChainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, TChain, TAccount>,
  parameters: RelayL2ToL2MessageParameters<TChain, TAccount, TChainOverride>,
): Promise<bigint> {
  const { sentMessageId, sentMessagePayload, ...txParameters } = parameters

  return estimateContractGas(client, {
    abi: l2ToL2CrossDomainMessengerAbi,
    address: contracts.l2ToL2CrossDomainMessenger.address,
    functionName: 'relayMessage',
    args: [sentMessageId, sentMessagePayload],
    ...txParameters,
  } as EstimateContractGasParameters)
}

/**
 * Simulate contract call for {@link relayL2ToL2Message}
 * @category L2 Public Actions
 * @param client - L2 Public Client
 * @param parameters - {@link Relay2ToL2MessageParameters}
 * @returns The contract functions return value. {@link RelayL2ToL2MessageContractReturnType}
 */
export async function simulateRelayL2ToL2Message<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
  TChainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, TChain, TAccount>,
  parameters: RelayL2ToL2MessageParameters<TChain, TAccount, TChainOverride>,
): Promise<RelayL2ToL2MessageContractReturnType> {
  const { account, sentMessageId, sentMessagePayload } = parameters

  const res = await simulateContract(client, {
    account,
    abi: l2ToL2CrossDomainMessengerAbi,
    address: contracts.l2ToL2CrossDomainMessenger.address,
    chain: client.chain,
    functionName: 'relayMessage',
    args: [sentMessageId, sentMessagePayload],
  } as SimulateContractParameters)

  return res.result as RelayL2ToL2MessageContractReturnType
}
