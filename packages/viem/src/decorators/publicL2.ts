import type { Account, Chain, Client, Transport } from 'viem'
import type { PublicActionsL2 as OpPublicActionsL2 } from 'viem/op-stack'
import { publicActionsL2 as opPublicActionsL2 } from 'viem/op-stack'

import type {
  DepositSuperchainWETHContractReturnType,
  DepositSuperchainWETHParameters,
  RelayMessageContractReturnType,
  RelayMessageParameters,
  SendETHContractReturnType,
  SendETHParameters,
  SendMessageContractReturnType,
  SendMessageParameters,
  SendSuperchainERC20ContractReturnType,
  SendSuperchainERC20Parameters,
  WithdrawSuperchainWETHContractReturnType,
  WithdrawSuperchainWETHParameters,
} from '@/actions/interop/index.js'
import {
  estimateDepositSuperchainWETHGas,
  estimateRelayMessageGas,
  estimateSendETHGas,
  estimateSendMessageGas,
  estimateSendSuperchainERC20Gas,
  estimateWithdrawSuperchainWETHGas,
  simulateDepositSuperchainWETH,
  simulateRelayMessage,
  simulateSendETH,
  simulateSendMessage,
  simulateSendSuperchainERC20,
  simulateWithdrawSuperchainWETH,
} from '@/actions/interop/index.js'

export type PublicInteropActionsL2<
  TChain extends Chain | undefined = Chain | undefined,
  TAccount extends Account | undefined = Account | undefined,
> = {
  estimateSendMessageGas: <
    TChainOverride extends Chain | undefined = undefined,
  >(
    parameters: SendMessageParameters<TChain, TAccount, TChainOverride>,
  ) => Promise<bigint>
  estimateRelayMessageGas: <
    TChainOverride extends Chain | undefined = undefined,
  >(
    parameters: RelayMessageParameters<TChain, TAccount, TChainOverride>,
  ) => Promise<bigint>
  estimateSendSuperchainERC20Gas: <
    TChainOverride extends Chain | undefined = undefined,
  >(
    parameters: SendSuperchainERC20Parameters<TChain, TAccount, TChainOverride>,
  ) => Promise<bigint>
  estimateDepositSuperchainWETHGas: <
    TChainOverride extends Chain | undefined = undefined,
  >(
    parameters: DepositSuperchainWETHParameters<
      TChain,
      TAccount,
      TChainOverride
    >,
  ) => Promise<bigint>
  estimateSendETHGas: <TChainOverride extends Chain | undefined = undefined>(
    parameters: SendETHParameters<TChain, TAccount, TChainOverride>,
  ) => Promise<bigint>
  estimateWithdrawSuperchainWETHGas: <
    TChainOverride extends Chain | undefined = undefined,
  >(
    parameters: WithdrawSuperchainWETHParameters<
      TChain,
      TAccount,
      TChainOverride
    >,
  ) => Promise<bigint>
  simulateSendMessage: <TChainOverride extends Chain | undefined = undefined>(
    parameters: SendMessageParameters<TChain, TAccount, TChainOverride>,
  ) => Promise<SendMessageContractReturnType>

  simulateRelayMessage: <TChainOverride extends Chain | undefined = undefined>(
    parameters: RelayMessageParameters<TChain, TAccount, TChainOverride>,
  ) => Promise<RelayMessageContractReturnType>

  simulateSendSuperchainERC20: <
    TChainOverride extends Chain | undefined = undefined,
  >(
    parameters: SendSuperchainERC20Parameters<TChain, TAccount, TChainOverride>,
  ) => Promise<SendSuperchainERC20ContractReturnType>
  simulateDepositSuperchainWETH: <
    TChainOverride extends Chain | undefined = undefined,
  >(
    parameters: DepositSuperchainWETHParameters<
      TChain,
      TAccount,
      TChainOverride
    >,
  ) => Promise<DepositSuperchainWETHContractReturnType>
  simulateSendETH: <TChainOverride extends Chain | undefined = undefined>(
    parameters: SendETHParameters<TChain, TAccount, TChainOverride>,
  ) => Promise<SendETHContractReturnType>
  simulateWithdrawSuperchainWETH: <
    TChainOverride extends Chain | undefined = undefined,
  >(
    parameters: WithdrawSuperchainWETHParameters<
      TChain,
      TAccount,
      TChainOverride
    >,
  ) => Promise<WithdrawSuperchainWETHContractReturnType>
}

export type PublicActionsL2<
  TChain extends Chain | undefined = Chain | undefined,
  TAccount extends Account | undefined = Account | undefined,
> = OpPublicActionsL2<TChain, TAccount> & {
  /** interop actions scoped under this member */
  interop: PublicInteropActionsL2<TChain, TAccount>
}

export function publicActionsL2() {
  return <
    TTransport extends Transport,
    TChain extends Chain | undefined = Chain | undefined,
    TAccount extends Account | undefined = Account | undefined,
  >(
    client: Client<TTransport, TChain, TAccount>,
  ) => {
    return {
      ...opPublicActionsL2(),
      interop: {
        estimateSendMessageGas: (args) => estimateSendMessageGas(client, args),
        estimateRelayMessageGas: (args) =>
          estimateRelayMessageGas(client, args),
        estimateSendSuperchainERC20Gas: (args) =>
          estimateSendSuperchainERC20Gas(client, args),
        estimateDepositSuperchainWETHGas: (args) =>
          estimateDepositSuperchainWETHGas(client, args),
        estimateWithdrawSuperchainWETHGas: (args) =>
          estimateWithdrawSuperchainWETHGas(client, args),
        estimateSendETHGas: (args) => estimateSendETHGas(client, args),
        simulateSendMessage: (args) => simulateSendMessage(client, args),
        simulateRelayMessage: (args) => simulateRelayMessage(client, args),
        simulateSendSuperchainERC20: (args) =>
          simulateSendSuperchainERC20(client, args),
        simulateDepositSuperchainWETH: (args) =>
          simulateDepositSuperchainWETH(client, args),
        simulateWithdrawSuperchainWETH: (args) =>
          simulateWithdrawSuperchainWETH(client, args),
        simulateSendETH: (args) => simulateSendETH(client, args),
      },
    } as PublicActionsL2<TChain, TAccount>
  }
}
