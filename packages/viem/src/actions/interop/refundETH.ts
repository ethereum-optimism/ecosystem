/** @module refundETH */
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

import { superchainETHBridgeAbi } from '@/abis/index.js'
import { interopContracts } from '@/contracts.js'
import type { BaseWriteContractActionParameters } from '@/core/baseWriteAction.js'
import { baseWriteAction } from '@/core/baseWriteAction.js'
import type { ErrorType } from '@/types/utils.js'

/**
 * @category Types
 */
export type RefundETHParameters<
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
  /** Chain ID that the expired `sendETH` was sent to. */
  destinationChainId: number | bigint
  /** Nonce of the expired message (the `messageNonce` of its `SentMessage` event). */
  messageNonce: bigint
  /** The `to` address passed to the expired `sendETH`. */
  to: Address
  /** The amount of ETH sent by the expired `sendETH`. */
  amount: bigint
}

/**
 * @category Types
 */
export type RefundETHReturnType = Hash

/**
 * @category Types
 */
export type RefundETHContractReturnType = ContractFunctionReturnType<
  typeof superchainETHBridgeAbi,
  'nonpayable',
  'refundETH'
>

/**
 * @category Types
 */
export type RefundETHErrorType =
  | EstimateContractGasErrorType
  | WriteContractErrorType
  | ErrorType

function toContractArgs(
  parameters: Pick<
    RefundETHParameters,
    'destinationChainId' | 'messageNonce' | 'to' | 'amount'
  >,
) {
  const { destinationChainId, messageNonce, to, amount } = parameters
  return [BigInt(destinationChainId), messageNonce, to, amount] as const
}

/**
 * Refunds the ETH of an expired {@link sendETH}, using
 * `SuperchainETHBridge.refundETH`. Added in OP Stack Upgrade 22 (Lagoon).
 *
 * Call it on the source chain, from the account that called `sendETH`: the
 * bridge rebuilds the message hash with the caller as the sender, and the
 * refund goes to the caller, not to `to`. It reverts with
 * `SuperchainETHBridge_MessageNotExpired` until the message is marked expired
 * (see {@link getCrossDomainMessageExpiry}), and with
 * `SuperchainETHBridge_AlreadyRefunded` if it was already refunded.
 * `ETHLiquidity` must not be paused (see {@link getETHLiquidityPaused}).
 * @category Actions
 * @param client - Client connected to the source chain of the expired send
 * @param parameters - {@link RefundETHParameters}
 * @returns transaction hash - {@link RefundETHReturnType}
 * @example
 * import { createWalletClient, decodeFunctionData, http } from 'viem'
 * import { op } from '@eth-optimism/viem/chains'
 * import { superchainETHBridgeAbi } from '@eth-optimism/viem/abis'
 * import { refundETH } from '@eth-optimism/viem/actions/interop'
 *
 * // `message` is the expired SuperchainETHBridge message from getCrossDomainMessages.
 * const { args: [, to, amount] } = decodeFunctionData({ abi: superchainETHBridgeAbi, data: message.message })
 *
 * const walletClientOp = createWalletClient({ chain: op, transport: http(), account })
 * const hash = await refundETH(walletClientOp, {
 *   destinationChainId: message.destination,
 *   messageNonce: message.nonce,
 *   to,
 *   amount,
 * })
 */
export async function refundETH<
  chain extends Chain | undefined,
  account extends Account | undefined,
  chainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: RefundETHParameters<chain, account, chainOverride>,
): Promise<RefundETHReturnType> {
  const { destinationChainId, messageNonce, to, amount, ...txParameters } =
    parameters

  return baseWriteAction(
    client,
    {
      abi: superchainETHBridgeAbi,
      contractAddress: interopContracts.superchainETHBridge.address,
      contractFunctionName: 'refundETH',
      contractArgs: toContractArgs({
        destinationChainId,
        messageNonce,
        to,
        amount,
      }),
    },
    txParameters as BaseWriteContractActionParameters,
  )
}

/**
 * Estimates gas for {@link refundETH}
 * @category Actions
 * @param client - Client connected to the source chain of the expired send
 * @param parameters - {@link RefundETHParameters}
 * @returns estimated gas value.
 */
export async function estimateRefundETHGas<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
  TChainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, TChain, TAccount>,
  parameters: RefundETHParameters<TChain, TAccount, TChainOverride>,
): Promise<bigint> {
  const { destinationChainId, messageNonce, to, amount, ...txParameters } =
    parameters

  return estimateContractGas(client, {
    abi: superchainETHBridgeAbi,
    address: interopContracts.superchainETHBridge.address,
    functionName: 'refundETH',
    args: toContractArgs({ destinationChainId, messageNonce, to, amount }),
    ...txParameters,
  } as EstimateContractGasParameters)
}

/**
 * Simulate contract call for {@link refundETH}
 * @category Actions
 * @param client - Client connected to the source chain of the expired send
 * @param parameters - {@link RefundETHParameters}
 * @returns contract return value - {@link RefundETHContractReturnType}
 */
export async function simulateRefundETH<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
  TChainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, TChain, TAccount>,
  parameters: RefundETHParameters<TChain, TAccount, TChainOverride>,
): Promise<RefundETHContractReturnType> {
  const { destinationChainId, messageNonce, to, amount, ...txParameters } =
    parameters

  const res = await simulateContract(client, {
    abi: superchainETHBridgeAbi,
    address: interopContracts.superchainETHBridge.address,
    chain: client.chain,
    functionName: 'refundETH',
    args: toContractArgs({ destinationChainId, messageNonce, to, amount }),
    ...txParameters,
  } as SimulateContractParameters)

  return res.result as RefundETHContractReturnType
}
