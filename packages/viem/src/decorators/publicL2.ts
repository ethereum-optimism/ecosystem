import type { Account, Chain, Client, Transport } from 'viem'
import type { PublicActionsL2 as UpstreamPublicActionsL2 } from 'viem/op-stack'
import { publicActionsL2 as upstreamPublicActionsL2 } from 'viem/op-stack'

import type {
  CrossChainSendETHContractReturnType,
  CrossChainSendETHParameters,
} from '@/actions/crosschainSendETH.js'
import {
  estimateCrossChainSendETHGas,
  simulateCrossChainSendETH,
} from '@/actions/crosschainSendETH.js'
import type {
  DepositSuperchainWETHContractReturnType,
  DepositSuperchainWETHParameters,
} from '@/actions/depositSuperchainWETH.js'
import {
  estimateDepositSuperchainWETHGas,
  simulateDepositSuperchainWETH,
} from '@/actions/depositSuperchainWETH.js'
import type {
  RelayL2ToL2MessageContractReturnType,
  RelayL2ToL2MessageParameters,
} from '@/actions/relayL2ToL2Message.js'
import {
  estimateRelayL2ToL2MessageGas,
  simulateRelayL2ToL2Message,
} from '@/actions/relayL2ToL2Message.js'
import type {
  SendL2ToL2MessageContractReturnType,
  SendL2ToL2MessageParameters,
} from '@/actions/sendL2ToL2Message.js'
import {
  estimateSendL2ToL2MessageGas,
  simulateSendL2ToL2Message,
} from '@/actions/sendL2ToL2Message.js'
import type {
  SendSuperchainERC20ContractReturnType,
  SendSuperchainERC20Parameters,
} from '@/actions/sendSuperchainERC20.js'
import {
  estimateSendSuperchainERC20Gas,
  simulateSendSuperchainERC20,
} from '@/actions/sendSuperchainERC20.js'
import type { SendSuperchainWETHParameters } from '@/actions/sendSuperchainWETH.js'
import {
  estimateSendSuperchainWETHGas,
  simulateSendSuperchainWETH,
} from '@/actions/sendSuperchainWETH.js'
import {
  estimateWithdrawSuperchainWETHGas,
  simulateWithdrawSuperchainWETH,
  type WithdrawSuperchainWETHContractReturnType,
  type WithdrawSuperchainWETHParameters,
} from '@/actions/withdrawSuperchainWETH.js'

export type PublicActionsL2<
  TChain extends Chain | undefined = Chain | undefined,
  TAccount extends Account | undefined = Account | undefined,
> = UpstreamPublicActionsL2 & {
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

  estimateSendSuperchainWETHGas: <
    TChainOverride extends Chain | undefined = undefined,
  >(
    parameters: SendSuperchainWETHParameters<TChain, TAccount, TChainOverride>,
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

  simulateSendSuperchainERC20: <TChainOverride extends Chain | undefined = undefined>(
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

  simulateSendSuperchainWETH: <
    TChainOverride extends Chain | undefined = undefined,
  >(
    parameters: SendSuperchainWETHParameters<TChain, TAccount, TChainOverride>,
  ) => Promise<SendSuperchainERC20ContractReturnType>
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
      ...upstreamPublicActionsL2(),
      estimateSendL2ToL2MessageGas: (args) =>
        estimateSendL2ToL2MessageGas(client, args),
      estimateRelayL2ToL2MessageGas: (args) =>
        estimateRelayL2ToL2MessageGas(client, args),
      estimateSendSuperchainERC20Gas: (args) => estimateSendSuperchainERC20Gas(client, args),
      estimateSendSuperchainWETHGas: (args) =>
        estimateSendSuperchainWETHGas(client, args),
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
      simulateSendSuperchainERC20: (args) => simulateSendSuperchainERC20(client, args),
      simulateDepositSuperchainWETH: (args) =>
        simulateDepositSuperchainWETH(client, args),
      simulateWithdrawSuperchainWETH: (args) =>
        simulateWithdrawSuperchainWETH(client, args),
      simulateSendSuperchainWETH: (args) =>
        simulateSendSuperchainWETH(client, args),
      simulateCrossChainSendETH: (args) =>
        simulateCrossChainSendETH(client, args),
    } as PublicActionsL2<TChain, TAccount>
  }
}
