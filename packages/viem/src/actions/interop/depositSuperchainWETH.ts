/** @module depositSuperchainWETH */
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

import { superchainWETHAbi } from '@/abis.js'
import { contracts } from '@/contracts.js'
import type { BaseWriteContractActionParameters } from '@/core/baseWriteAction.js'
import { baseWriteAction } from '@/core/baseWriteAction.js'
import type { ErrorType } from '@/types/utils.js'

/**
 * @category Types
 */
export type DepositSuperchainWETHParameters<
  TChain extends Chain | undefined = Chain | undefined,
  TAccount extends Account | undefined = Account | undefined,
  TChainOverride extends Chain | undefined = Chain | undefined,
  TDerivedChain extends Chain | undefined = DeriveChain<TChain, TChainOverride>,
> = BaseWriteContractActionParameters<
  TChain,
  TAccount,
  TChainOverride,
  TDerivedChain
>

/**
 * @category Types
 */
export type DepositSuperchainWETHReturnType = Hash

/**
 * @category Types
 */
export type DepositSuperchainWETHContractReturnType =
  ContractFunctionReturnType<typeof superchainWETHAbi, 'payable', 'deposit'>

/**
 * @category Types
 */
export type DepositSuperchainWETHErrorType =
  | EstimateContractGasErrorType
  | WriteContractErrorType
  | ErrorType

/**
 * Deposits ETH to the SuperchainWETH contract.
 * @category L2 Wallet Actions
 * @param client - L2 Wallet Client
 * @param parameters - {@link DepositSuperchainWETHParameters}
 * @returns The depositSuperchainWETH transaction hash. {@link DepositSuperchainWETHReturnType}
 */
export async function depositSuperchainWETH<
  chain extends Chain | undefined,
  account extends Account | undefined,
  chainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: DepositSuperchainWETHParameters<chain, account, chainOverride>,
): Promise<DepositSuperchainWETHReturnType> {
  return baseWriteAction(
    client,
    {
      abi: superchainWETHAbi,
      contractAddress: contracts.superchainWETH.address,
      contractFunctionName: 'deposit',
      contractArgs: [],
    },
    parameters,
  )
}

/**
 * Estimates gas for {@link depositSuperchainWETH}
 * @category L2 Wallet Actions
 * @param client - L2 Wallet Client
 * @param parameters - {@link DepositSuperchainWETHParameters}
 * @returns The estimated gas value.
 */
export async function estimateDepositSuperchainWETHGas<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
  TChainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, TChain, TAccount>,
  parameters: DepositSuperchainWETHParameters<TChain, TAccount, TChainOverride>,
): Promise<bigint> {
  return estimateContractGas(client, {
    abi: superchainWETHAbi,
    address: contracts.superchainWETH.address,
    functionName: 'deposit',
    args: [],
    ...parameters,
  } as EstimateContractGasParameters)
}

/**
 * Simulate contract call for {@link depositSuperchainWETH}
 * @category L2 Public Actions
 * @param client - L2 Public Client
 * @param parameters - {@link DepositSuperchainWETHParameters}
 * @returns The contract functions return value. {@link depositSuperchainWETHContractReturnType}
 */
export async function simulateDepositSuperchainWETH<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
  TChainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, TChain, TAccount>,
  parameters: DepositSuperchainWETHParameters<TChain, TAccount, TChainOverride>,
): Promise<DepositSuperchainWETHContractReturnType> {
  const { account, value } = parameters

  const res = await simulateContract(client, {
    account,
    abi: superchainWETHAbi,
    address: contracts.superchainWETH.address,
    chain: client.chain,
    functionName: 'deposit',
    args: [],
    value,
  } as SimulateContractParameters)

  return res.result as DepositSuperchainWETHContractReturnType
}
