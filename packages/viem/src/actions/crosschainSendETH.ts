/** @module crosschainSendETH */
import type {
  Account,
  Address,
  Chain,
  Client,
  ContractFunctionReturnType,
  DeriveChain,
  EstimateContractGasErrorType,
  EstimateContractGasParameters,
  SimulateContractParameters,
  Transport,
  WriteContractErrorType,
} from 'viem'
import { estimateContractGas, simulateContract } from 'viem/actions'

import { superchainWETHABI } from '@/abis.js'
import { contracts } from '@/contracts.js'
import type { BaseWriteContractActionParameters } from '@/core/baseWriteAction.js'
import { baseWriteAction } from '@/core/baseWriteAction.js'
import type { ErrorType } from '@/types/utils.js'

/**
 * @category Types
 */
export type CrossChainSendETHParameters<
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
  /** Address to send ETH to. */
  to: Address
  /** Chain ID of the destination chain. */
  chainId: number
}

/**
 * @category Types
 */
export type CrossChainSendETHContractReturnType = ContractFunctionReturnType<
  typeof superchainWETHABI,
  'payable',
  'sendETH'
>

/**
 * @category Types
 */
export type CrossChainSendETHErrorType =
  | EstimateContractGasErrorType
  | WriteContractErrorType
  | ErrorType

/**
 * Sends ETH to the specified recipient on the destination chain
 * @category L2 Wallet Actions
 * @param client - L2 Wallet Client
 * @param parameters - {@link CrossChainSendETHParameters}
 * @returns The crosschainSendETH transaction hash. {@link CrossChainSendETHContractReturnType}
 */
export async function crossChainSendETH<
  chain extends Chain | undefined,
  account extends Account | undefined,
  chainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: CrossChainSendETHParameters<chain, account, chainOverride>,
): Promise<CrossChainSendETHContractReturnType> {
  const { to, chainId, ...txParameters } = parameters

  return baseWriteAction(
    client,
    {
      abi: superchainWETHABI,
      contractAddress: contracts.superchainWETH.address,
      contractFunctionName: 'sendETH',
      contractArgs: [to, chainId],
    },
    txParameters as BaseWriteContractActionParameters,
  )
}

/**
 * Estimates gas for {@link crossChainSendETH}
 * @category L2 Wallet Actions
 * @param client - L2 Wallet Client
 * @param parameters - {@link CrossChainSendETHParameters}
 * @returns The estimated gas value.
 */
export async function estimateCrossChainSendETHGas<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
  TChainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, TChain, TAccount>,
  parameters: CrossChainSendETHParameters<TChain, TAccount, TChainOverride>,
): Promise<bigint> {
  const { to, chainId, ...txParameters } = parameters

  return estimateContractGas(client, {
    abi: superchainWETHABI,
    address: contracts.superchainWETH.address,
    functionName: 'sendETH',
    args: [to, chainId],
    ...txParameters,
  } as EstimateContractGasParameters)
}

/**
 * Simulate contract call for {@link crossChainSendETH}
 * @category L2 Public Actions
 * @param client - L2 Public Client
 * @param parameters - {@link CrossChainSendETHParameters}
 * @returns The contract functions return value. {@link CrossChainSendETHContractReturnType}
 */
export async function simulateCrossChainSendETH<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
  TChainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, TChain, TAccount>,
  parameters: CrossChainSendETHParameters<TChain, TAccount, TChainOverride>,
): Promise<CrossChainSendETHContractReturnType> {
  const { account, value, to, chainId } = parameters

  const res = await simulateContract(client, {
    account,
    abi: superchainWETHABI,
    address: contracts.superchainWETH.address,
    chain: client.chain,
    functionName: 'sendETH',
    args: [to, chainId],
    value,
  } as SimulateContractParameters)

  return res.result as CrossChainSendETHContractReturnType
}
