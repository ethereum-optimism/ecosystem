/** @module sendSuperchainWETH */
import type {
  Account,
  Address,
  Chain,
  Client,
  DeriveChain,
  Transport,
} from 'viem'

import { contracts } from '@/contracts.js'
import type { BaseWriteContractActionParameters } from '@/core/baseWriteAction.js'

import type {
  SendSupERC20ContractReturnType,
  SendSupERC20ReturnType,
} from './sendSupERC20.js'
import {
  estimateSendSupERC20Gas,
  sendSupERC20,
  simulateSendSupERC20,
} from './sendSupERC20.js'

/**
 * @category Types
 */
export type SendSuperchainWETHParameters<
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
  /** Address to send tokens to. */
  to: Address
  /** Amount of tokens to send. */
  amount: bigint
  /** Chain ID of the destination chain. */
  chainId: number
}

/**
 * Sends SuperchainWETH to a target address on another chain. Used in the interop flow.
 * @category L2 Wallet Actions
 * @param client - L2 Wallet Client
 * @param parameters - {@link SendSuperchainWETHParameters}
 * @returns The sendSuperchainWETH transaction hash. {@link SendSupERC20ReturnType}
 */
export async function sendSuperchainWETH<
  chain extends Chain | undefined,
  account extends Account | undefined,
  chainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: SendSuperchainWETHParameters<chain, account, chainOverride>,
): Promise<SendSupERC20ReturnType> {
  return sendSupERC20(client, {
    ...parameters,
    tokenAddress: contracts.superchainWETH.address,
  })
}

/**
 * Estimates gas for {@link sendSuperchainWETH}
 * @category L2 Wallet Actions
 * @param client - L2 Wallet Client
 * @param parameters - {@link SendSuperchainWETHParameters}
 * @returns The estimated gas value.
 */
export async function estimateSendSuperchainWETHGas<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
  TChainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, TChain, TAccount>,
  parameters: SendSuperchainWETHParameters<TChain, TAccount, TChainOverride>,
): Promise<bigint> {
  return estimateSendSupERC20Gas(client, {
    ...parameters,
    tokenAddress: contracts.superchainWETH.address,
  })
}

/**
 * Simulate contract call for {@link sendSuperchainWETH}
 * @category L2 Public Actions
 * @param client - L2 Public Client
 * @param parameters - {@link SendSuperchainWETHParameters}
 * @returns The contract functions return value. {@link SendSupERC20ContractReturnType}
 */
export async function simulateSendSuperchainWETH<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
  TChainOverride extends Chain | undefined = undefined,
>(
  client: Client<Transport, TChain, TAccount>,
  parameters: SendSuperchainWETHParameters<TChain, TAccount, TChainOverride>,
): Promise<SendSupERC20ContractReturnType> {
  return simulateSendSupERC20(client, {
    ...parameters,
    tokenAddress: contracts.superchainWETH.address,
  })
}
