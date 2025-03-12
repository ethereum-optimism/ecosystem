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
import type { BuildExecutingMessageReturnType } from '@/actions/interop/buildExecutingMessage.js'
import { contracts } from '@/contracts.js'
import {
  baseWriteAction,
  type BaseWriteContractActionParameters,
} from '@/core/baseWriteAction.js'
import type { ErrorType } from '@/types/utils.js'

/**
 * @category Types
 */
export type RelayMessageParameters<
  TChain extends Chain | undefined = Chain | undefined,
  TAccount extends Account | undefined = Account | undefined,
  TChainOverride extends Chain | undefined = Chain | undefined,
  TDerivedChain extends Chain | undefined = DeriveChain<TChain, TChainOverride>,
> = BaseWriteContractActionParameters<
  TChain,
  TAccount,
  TChainOverride,
  TDerivedChain
> &
  /** executing message built from the sent message log */
  BuildExecutingMessageReturnType

/**
 * @category Types
 */
export type RelayMessageReturnType = Hash

/**
 * @category Types
 */
export type RelayMessageContractReturnType = ContractFunctionReturnType<
  typeof l2ToL2CrossDomainMessengerAbi,
  'payable',
  'relayMessage'
>

/**
 * @category Types
 */
export type RelayMessageErrorType =
  | EstimateContractGasErrorType
  | WriteContractErrorType
  | ErrorType

/**
 * Relays a message emitted by the CrossDomainMessenger
 * @category L2 Wallet Actions
 * @param client - Client to use
 * @param parameters - {@link RelayMessageParameters}
 * @returns The relayMessage transaction hash. {@link RelayMessageReturnType}
 * @example
 * import { createPublicClient } from 'viem'
 * import { http } from 'viem/transports'
 * import { op } from '@eth-optimism/viem/chains'
 *
 * const publicClientOp = createPublicClient({ chain: op, transport: http() })
 *
 * const receipt = await publicClientOp.getTransactionReceipt({ hash: '0x...' })
 * const messages = await getCrossDomainMessages(publicClientOp, { logs: receipt.logs })
 *
 * const params = await buildExecutingMessage(publicClientOp, { log: messages[0].log })
 * const hash = await relayMessage(publicClientOp, params)
 */
export async function relayMessage<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
  TChainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, TChain, TAccount>,
  parameters: RelayMessageParameters<TChain, TAccount, TChainOverride>,
): Promise<RelayMessageReturnType> {
  const { id, payload, ...txParameters } = parameters

  return baseWriteAction(
    client,
    {
      abi: l2ToL2CrossDomainMessengerAbi,
      contractAddress: contracts.l2ToL2CrossDomainMessenger.address,
      contractFunctionName: 'relayMessage',
      contractArgs: [id, payload],
    },
    txParameters as BaseWriteContractActionParameters,
  )
}

/**
 * Estimates gas for {@link relayMessage}
 * @category L2 Wallet Actions
 * @param client - Client to use
 * @param parameters - {@link RelayMessageParameters}
 * @returns The estimated gas value.
 */
export async function estimateRelayMessageGas<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
  TChainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, TChain, TAccount>,
  parameters: RelayMessageParameters<TChain, TAccount, TChainOverride>,
): Promise<bigint> {
  const { id, payload, ...txParameters } = parameters

  return estimateContractGas(client, {
    abi: l2ToL2CrossDomainMessengerAbi,
    address: contracts.l2ToL2CrossDomainMessenger.address,
    functionName: 'relayMessage',
    args: [id, payload],
    ...txParameters,
  } as EstimateContractGasParameters)
}

/**
 * Simulate contract call for {@link relayMessage}
 * @category L2 Public Actions
 * @param client - L2 Public Client
 * @param parameters - {@link Relay2ToL2MessageParameters}
 * @returns The contract functions return value. {@link RelayMessageContractReturnType}
 */
export async function simulateRelayMessage<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
  TChainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, TChain, TAccount>,
  parameters: RelayMessageParameters<TChain, TAccount, TChainOverride>,
): Promise<RelayMessageContractReturnType> {
  const { account, id, payload } = parameters

  const res = await simulateContract(client, {
    account,
    abi: l2ToL2CrossDomainMessengerAbi,
    address: contracts.l2ToL2CrossDomainMessenger.address,
    chain: client.chain,
    functionName: 'relayMessage',
    args: [id, payload],
  } as SimulateContractParameters)

  return res.result as RelayMessageContractReturnType
}
