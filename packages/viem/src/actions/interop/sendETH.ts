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

import { superchainWETHAbi } from '@/abis.js'
import { contracts } from '@/contracts.js'
import type { BaseWriteContractActionParameters } from '@/core/baseWriteAction.js'
import { baseWriteAction } from '@/core/baseWriteAction.js'
import type { ErrorType } from '@/types/utils.js'

/**
 * @category Types
 */
export type SendETHParameters<
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
export type SendETHContractReturnType = ContractFunctionReturnType<
  typeof superchainWETHAbi,
  'payable',
  'sendETH'
>

/**
 * @category Types
 */
export type SendETHErrorType =
  | EstimateContractGasErrorType
  | WriteContractErrorType
  | ErrorType

/**
 * Sends ETH to the specified recipient on the destination chain
 * @category L2 Wallet Actions
 * @param client - L2 Wallet Client
 * @param parameters - {@link SendETHParameters}
 * @returns The crosschainSendETH transaction hash. {@link SendETHContractReturnType}
 */
export async function sendETH<
  chain extends Chain | undefined,
  account extends Account | undefined,
  chainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: SendETHParameters<chain, account, chainOverride>,
): Promise<SendETHContractReturnType> {
  const { to, chainId, ...txParameters } = parameters

  return baseWriteAction(
    client,
    {
      abi: superchainWETHAbi,
      contractAddress: contracts.superchainWETH.address,
      contractFunctionName: 'sendETH',
      contractArgs: [to, chainId],
    },
    txParameters as BaseWriteContractActionParameters,
  )
}

/**
 * Estimates gas for {@link sendETH}
 * @category L2 Wallet Actions
 * @param client - L2 Wallet Client
 * @param parameters - {@link SendETHParameters}
 * @returns The estimated gas value.
 */
export async function estimateSendETHGas<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
  TChainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, TChain, TAccount>,
  parameters: SendETHParameters<TChain, TAccount, TChainOverride>,
): Promise<bigint> {
  const { to, chainId, ...txParameters } = parameters

  return estimateContractGas(client, {
    abi: superchainWETHAbi,
    address: contracts.superchainWETH.address,
    functionName: 'sendETH',
    args: [to, chainId],
    ...txParameters,
  } as EstimateContractGasParameters)
}

/**
 * Simulate contract call for {@link sendETH}
 * @category L2 Public Actions
 * @param client - L2 Public Client
 * @param parameters - {@link SendETHParameters}
 * @returns The contract functions return value. {@link SendETHContractReturnType}
 */
export async function simulateSendETH<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
  TChainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, TChain, TAccount>,
  parameters: SendETHParameters<TChain, TAccount, TChainOverride>,
): Promise<SendETHContractReturnType> {
  const { account, value, to, chainId } = parameters

  const res = await simulateContract(client, {
    account,
    abi: superchainWETHAbi,
    address: contracts.superchainWETH.address,
    chain: client.chain,
    functionName: 'sendETH',
    args: [to, chainId],
    value,
  } as SimulateContractParameters)

  return res.result as SendETHContractReturnType
}
