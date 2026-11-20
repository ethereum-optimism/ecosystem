/** @module exportUndeliveredMessage */
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
  SimulateContractParameters,
  Transport,
  WriteContractErrorType,
} from 'viem'
import { estimateContractGas, simulateContract } from 'viem/actions'

import { undeliveredMessageExporterAbi } from '@/abis/index.js'
import { interopContracts } from '@/contracts.js'
import type { BaseWriteContractActionParameters } from '@/core/baseWriteAction.js'
import { baseWriteAction } from '@/core/baseWriteAction.js'
import type { CrossDomainMessageFields } from '@/types/interop/cdm.js'
import type { ErrorType } from '@/types/utils.js'

/**
 * Default L1 gas limit reserved for the source chain's
 * `L1CrossDomainMessenger.relayUndeliveredMessage` call. Most of it pays for
 * the deposit that call makes back to the source chain. The OP Stack
 * acceptance tests use the same value. If it is too low, the call is kept as a
 * failed message on L1 and can be replayed.
 */
export const DEFAULT_EXPORT_UNDELIVERED_MESSAGE_MIN_GAS_LIMIT = 1_000_000

/**
 * @category Types
 */
export type ExportUndeliveredMessageParameters<
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
  /**
   * The undelivered message. Its `destination` must be the chain the client
   * is connected to: the exporter hashes the message with its own chain ID.
   */
  message: CrossDomainMessageFields
  /**
   * The source chain's `L1CrossDomainMessenger`, for example
   * `op.contracts.l1CrossDomainMessenger[mainnet.id].address`. If it is wrong,
   * nothing is marked expired and the message can be exported again.
   */
  sourceMessenger: Address
  /**
   * L1 gas limit for the source chain's
   * `L1CrossDomainMessenger.relayUndeliveredMessage` call.
   * Defaults to {@link DEFAULT_EXPORT_UNDELIVERED_MESSAGE_MIN_GAS_LIMIT}.
   */
  minGasLimit?: number | undefined
}

/**
 * @category Types
 */
export type ExportUndeliveredMessageReturnType = Hash

/**
 * @category Types
 */
export type ExportUndeliveredMessageContractReturnType =
  ContractFunctionReturnType<
    typeof undeliveredMessageExporterAbi,
    'nonpayable',
    'exportUndeliveredMessage'
  >

/**
 * @category Types
 */
export type ExportUndeliveredMessageErrorType =
  | EstimateContractGasErrorType
  | WriteContractErrorType
  | ErrorType

function toContractArgs(
  parameters: Pick<
    ExportUndeliveredMessageParameters,
    'message' | 'sourceMessenger' | 'minGasLimit'
  >,
) {
  const { message, sourceMessenger, minGasLimit } = parameters
  return [
    sourceMessenger,
    message.source,
    message.nonce,
    message.sender,
    message.target,
    message.message,
    minGasLimit ?? DEFAULT_EXPORT_UNDELIVERED_MESSAGE_MIN_GAS_LIMIT,
  ] as const
}

/**
 * Exports an undelivered interop message from its destination chain, using
 * the `UndeliveredMessageExporter` predeploy. Added in OP Stack Upgrade 22
 * (Lagoon).
 *
 * The exporter checks that the message was not relayed on this chain and sends
 * `relayUndeliveredMessage(messageHash, block.timestamp)` to the source chain's
 * `L1CrossDomainMessenger` as an L2 to L1 withdrawal. Once that withdrawal is
 * proven and finalized on L1, the source chain marks the message expired. That
 * only succeeds if this export happens more than the source chain's
 * `expiryPeriod()` (8 days on production networks) after the message was sent.
 * See {@link getCrossDomainMessageExpiry}.
 *
 * Anyone can call this, and it can also be forced in through a deposit if the
 * destination chain's sequencer does not include it.
 * @category Actions
 * @param client - Client connected to the message's destination chain
 * @param parameters - {@link ExportUndeliveredMessageParameters}
 * @returns transaction hash - {@link ExportUndeliveredMessageReturnType}
 * @example
 * import { createWalletClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { op, unichain } from '@eth-optimism/viem/chains'
 * import { exportUndeliveredMessage } from '@eth-optimism/viem/actions/interop'
 *
 * // `message` was sent on OP Mainnet to Unichain and never relayed.
 * const walletClientUnichain = createWalletClient({ chain: unichain, transport: http(), account })
 * const hash = await exportUndeliveredMessage(walletClientUnichain, {
 *   message,
 *   sourceMessenger: op.contracts.l1CrossDomainMessenger[mainnet.id].address,
 * })
 */
export async function exportUndeliveredMessage<
  chain extends Chain | undefined,
  account extends Account | undefined,
  chainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: ExportUndeliveredMessageParameters<chain, account, chainOverride>,
): Promise<ExportUndeliveredMessageReturnType> {
  const { message, sourceMessenger, minGasLimit, ...txParameters } = parameters

  return baseWriteAction(
    client,
    {
      abi: undeliveredMessageExporterAbi,
      contractAddress: interopContracts.undeliveredMessageExporter.address,
      contractFunctionName: 'exportUndeliveredMessage',
      contractArgs: toContractArgs({ message, sourceMessenger, minGasLimit }),
    },
    txParameters as BaseWriteContractActionParameters,
  )
}

/**
 * Estimates gas for {@link exportUndeliveredMessage}
 * @category Actions
 * @param client - Client connected to the message's destination chain
 * @param parameters - {@link ExportUndeliveredMessageParameters}
 * @returns estimated gas value.
 */
export async function estimateExportUndeliveredMessageGas<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
  TChainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, TChain, TAccount>,
  parameters: ExportUndeliveredMessageParameters<
    TChain,
    TAccount,
    TChainOverride
  >,
): Promise<bigint> {
  const { message, sourceMessenger, minGasLimit, ...txParameters } = parameters

  return estimateContractGas(client, {
    abi: undeliveredMessageExporterAbi,
    address: interopContracts.undeliveredMessageExporter.address,
    functionName: 'exportUndeliveredMessage',
    args: toContractArgs({ message, sourceMessenger, minGasLimit }),
    ...txParameters,
  } as EstimateContractGasParameters)
}

/**
 * Simulate contract call for {@link exportUndeliveredMessage}. Reverts with
 * `UndeliveredMessageExporter_MessageRelayed` if the message was relayed.
 * @category Actions
 * @param client - Client connected to the message's destination chain
 * @param parameters - {@link ExportUndeliveredMessageParameters}
 * @returns the message hash - {@link ExportUndeliveredMessageContractReturnType}
 */
export async function simulateExportUndeliveredMessage<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
  TChainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, TChain, TAccount>,
  parameters: ExportUndeliveredMessageParameters<
    TChain,
    TAccount,
    TChainOverride
  >,
): Promise<ExportUndeliveredMessageContractReturnType> {
  const { message, sourceMessenger, minGasLimit, ...txParameters } = parameters

  const res = await simulateContract(client, {
    abi: undeliveredMessageExporterAbi,
    address: interopContracts.undeliveredMessageExporter.address,
    chain: client.chain,
    functionName: 'exportUndeliveredMessage',
    args: toContractArgs({ message, sourceMessenger, minGasLimit }),
    ...txParameters,
  } as SimulateContractParameters)

  return res.result as ExportUndeliveredMessageContractReturnType
}
