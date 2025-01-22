import type { Account, Chain, Client, Transport } from 'viem'
import type { PublicActionsL2 as OpPublicActionsL2 } from 'viem/op-stack'
import { publicActionsL2 as opPublicActionsL2 } from 'viem/op-stack'

import type {
  CrossChainSendETHContractReturnType,
  CrossChainSendETHParameters,
  DepositSuperchainWETHContractReturnType,
  DepositSuperchainWETHParameters,
  RelayL2ToL2MessageContractReturnType,
  RelayL2ToL2MessageParameters,
  SendL2ToL2MessageContractReturnType,
  SendL2ToL2MessageParameters,
  SendSuperchainERC20ContractReturnType,
  SendSuperchainERC20Parameters,
  WithdrawSuperchainWETHContractReturnType,
  WithdrawSuperchainWETHParameters,
} from '@/actions/interop/index.js'
import {
  estimateCrossChainSendETHGas,
  estimateDepositSuperchainWETHGas,
  estimateRelayL2ToL2MessageGas,
  estimateSendL2ToL2MessageGas,
  estimateSendSuperchainERC20Gas,
  estimateWithdrawSuperchainWETHGas,
  simulateCrossChainSendETH,
  simulateDepositSuperchainWETH,
  simulateRelayL2ToL2Message,
  simulateSendL2ToL2Message,
  simulateSendSuperchainERC20,
  simulateWithdrawSuperchainWETH,
} from '@/actions/interop/index.js'

export type PublicInteropActionsL2<
  TChain extends Chain | undefined = Chain | undefined,
  TAccount extends Account | undefined = Account | undefined,
> = {
  estimateSendL2ToL2MessageGas: <
    TChainOverride extends Chain | undefined = undefined,
  >(
    parameters: SendL2ToL2MessageParameters<TChain, TAccount, TChainOverride>,
  ) => Promise<bigint>
  estimateRelayL2ToL2MessageGas: <
    TChainOverride extends Chain | undefined = undefined,
  >(
    parameters: RelayL2ToL2MessageParameters<TChain, TAccount, TChainOverride>,
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
  estimateCrossChainSendETHGas: <
    TChainOverride extends Chain | undefined = undefined,
  >(
    parameters: CrossChainSendETHParameters<TChain, TAccount, TChainOverride>,
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
  simulateSendL2ToL2Message: <
    TChainOverride extends Chain | undefined = undefined,
  >(
    parameters: SendL2ToL2MessageParameters<TChain, TAccount, TChainOverride>,
  ) => Promise<SendL2ToL2MessageContractReturnType>

  simulateRelayL2ToL2Message: <
    TChainOverride extends Chain | undefined = undefined,
  >(
    parameters: RelayL2ToL2MessageParameters<TChain, TAccount, TChainOverride>,
  ) => Promise<RelayL2ToL2MessageContractReturnType>

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
  simulateCrossChainSendETH: <
    TChainOverride extends Chain | undefined = undefined,
  >(
    parameters: CrossChainSendETHParameters<TChain, TAccount, TChainOverride>,
  ) => Promise<CrossChainSendETHContractReturnType>
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
        estimateSendL2ToL2MessageGas: (args) =>
          estimateSendL2ToL2MessageGas(client, args),
        estimateRelayL2ToL2MessageGas: (args) =>
          estimateRelayL2ToL2MessageGas(client, args),
        estimateSendSuperchainERC20Gas: (args) =>
          estimateSendSuperchainERC20Gas(client, args),
        estimateDepositSuperchainWETHGas: (args) =>
          estimateDepositSuperchainWETHGas(client, args),
        estimateWithdrawSuperchainWETHGas: (args) =>
          estimateWithdrawSuperchainWETHGas(client, args),
        estimateCrossChainSendETHGas: (args) =>
          estimateCrossChainSendETHGas(client, args),
        simulateSendL2ToL2Message: (args) =>
          simulateSendL2ToL2Message(client, args),
        simulateRelayL2ToL2Message: (args) =>
          simulateRelayL2ToL2Message(client, args),
        simulateSendSuperchainERC20: (args) =>
          simulateSendSuperchainERC20(client, args),
        simulateDepositSuperchainWETH: (args) =>
          simulateDepositSuperchainWETH(client, args),
        simulateWithdrawSuperchainWETH: (args) =>
          simulateWithdrawSuperchainWETH(client, args),
        simulateCrossChainSendETH: (args) =>
          simulateCrossChainSendETH(client, args),
      },
    } as PublicActionsL2<TChain, TAccount>
  }
}
