/** @module withdrawSuperchainWETH */
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
export type WithdrawSuperchainWETHParameters<
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
  /** Amount of SuperchainWETH to withdraw. */
  amount: bigint
}

/**
 * @category Types
 */
export type WithdrawSuperchainWETHReturnType = Hash

/**
 * @category Types
 */
export type WithdrawSuperchainWETHContractReturnType =
  ContractFunctionReturnType<typeof superchainWETHAbi, 'nonpayable', 'withdraw'>

/**
 * @category Types
 */
export type WithdrawSuperchainWETHErrorType =
  | EstimateContractGasErrorType
  | WriteContractErrorType
  | ErrorType

/**
 * Deposits ETH to the SuperchainWETH contract.
 * @category L2 Wallet Actions
 * @param client - L2 Wallet Client
 * @param parameters - {@link WithdrawSuperchainWETHParameters}
 * @returns The withdrawSuperchainWETH transaction hash. {@link WithdrawSuperchainWETHReturnType}
 */
export async function withdrawSuperchainWETH<
  chain extends Chain | undefined,
  account extends Account | undefined,
  chainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: WithdrawSuperchainWETHParameters<chain, account, chainOverride>,
): Promise<WithdrawSuperchainWETHReturnType> {
  const { amount, ...txParameters } = parameters

  return baseWriteAction(
    client,
    {
      abi: superchainWETHAbi,
      contractAddress: contracts.superchainWETH.address,
      contractFunctionName: 'withdraw',
      contractArgs: [amount],
    },
    txParameters as BaseWriteContractActionParameters,
  )
}

/**
 * Estimates gas for {@link withdrawSuperchainWETH}
 * @category L2 Wallet Actions
 * @param client - L2 Wallet Client
 * @param parameters - {@link WithdrawSuperchainWETHParameters}
 * @returns The estimated gas value.
 */
export async function estimateWithdrawSuperchainWETHGas<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
  TChainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, TChain, TAccount>,
  parameters: WithdrawSuperchainWETHParameters<
    TChain,
    TAccount,
    TChainOverride
  >,
): Promise<bigint> {
  const { amount, ...txParameters } = parameters

  return estimateContractGas(client, {
    abi: superchainWETHAbi,
    address: contracts.superchainWETH.address,
    functionName: 'withdraw',
    args: [amount],
    ...txParameters,
  } as EstimateContractGasParameters)
}

/**
 * Simulate contract call for {@link withdrawSuperchainWETH}
 * @category L2 Public Actions
 * @param client - L2 Public Client
 * @param parameters - {@link WithdrawSuperchainWETHParameters}
 * @returns The contract functions return value. {@link withdrawSuperchainWETHContractReturnType}
 */
export async function simulateWithdrawSuperchainWETH<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
  TChainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, TChain, TAccount>,
  parameters: WithdrawSuperchainWETHParameters<
    TChain,
    TAccount,
    TChainOverride
  >,
): Promise<WithdrawSuperchainWETHContractReturnType> {
  const { account, amount } = parameters

  const res = await simulateContract(client, {
    account,
    abi: superchainWETHAbi,
    address: contracts.superchainWETH.address,
    chain: client.chain,
    functionName: 'withdraw',
    args: [amount],
  } as SimulateContractParameters)

  return res.result as WithdrawSuperchainWETHContractReturnType
}
