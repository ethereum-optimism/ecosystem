import type { Account, Chain, Client, Transport } from 'viem'
import type { WalletActionsL2 as UpstreamWalletActionsL2 } from 'viem/op-stack'
import { walletActionsL2 as upstreamWalletActionsL2 } from 'viem/op-stack'

import {
  crossChainSendETH,
  type CrossChainSendETHContractReturnType,
  type CrossChainSendETHParameters,
} from '@/actions/crosschainSendETH.js'
import {
  depositSuperchainWETH,
  type DepositSuperchainWETHParameters,
  type DepositSuperchainWETHReturnType,
} from '@/actions/depositSuperchainWETH.js'
import type {
  RelayL2ToL2MessageParameters,
  RelayL2ToL2MessageReturnType,
} from '@/actions/relayL2ToL2Message.js'
import { relayL2ToL2Message } from '@/actions/relayL2ToL2Message.js'
import type {
  SendL2ToL2MessageParameters,
  SendL2ToL2MessageReturnType,
} from '@/actions/sendL2ToL2Message.js'
import { sendL2ToL2Message } from '@/actions/sendL2ToL2Message.js'
import type {
  SendSuperchainERC20Parameters,
  SendSuperchainERC20ReturnType,
} from '@/actions/sendSuperchainERC20.js'
import { sendSuperchainERC20 } from '@/actions/sendSuperchainERC20.js'
import type { SendSuperchainWETHParameters } from '@/actions/sendSuperchainWETH.js'
import { sendSuperchainWETH } from '@/actions/sendSuperchainWETH.js'
import {
  withdrawSuperchainWETH,
  type WithdrawSuperchainWETHParameters,
  type WithdrawSuperchainWETHReturnType,
} from '@/actions/withdrawSuperchainWETH.js'

export type WalletActionsL2<
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
> = UpstreamWalletActionsL2<chain, account> & {
  sendL2ToL2Message: <chainOverride extends Chain | undefined = undefined>(
    parameters: SendL2ToL2MessageParameters<chain, account, chainOverride>,
  ) => Promise<SendL2ToL2MessageReturnType>
  relayL2ToL2Message: <chainOverride extends Chain | undefined = undefined>(
    parameters: RelayL2ToL2MessageParameters<chain, account, chainOverride>,
  ) => Promise<RelayL2ToL2MessageReturnType>
  sendSuperchainERC20: <chainOverride extends Chain | undefined = undefined>(
    parameters: SendSuperchainERC20Parameters<chain, account, chainOverride>,
  ) => Promise<SendSuperchainERC20ReturnType>
  sendSuperchainWETH: <chainOverride extends Chain | undefined = undefined>(
    parameters: SendSuperchainWETHParameters<chain, account, chainOverride>,
  ) => Promise<SendSuperchainERC20ReturnType>
  depositSuperchainWETH: <chainOverride extends Chain | undefined = undefined>(
    parameters: DepositSuperchainWETHParameters<chain, account, chainOverride>,
  ) => Promise<DepositSuperchainWETHReturnType>
  withdrawSuperchainWETH: <chainOverride extends Chain | undefined = undefined>(
    parameters: WithdrawSuperchainWETHParameters<chain, account, chainOverride>,
  ) => Promise<WithdrawSuperchainWETHReturnType>
  crossChainSendETH: <chainOverride extends Chain | undefined = undefined>(
    parameters: CrossChainSendETHParameters<chain, account, chainOverride>,
  ) => Promise<CrossChainSendETHContractReturnType>
}

export function walletActionsL2() {
  return <
    transport extends Transport,
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  >(
    client: Client<transport, chain, account>,
  ): WalletActionsL2<chain, account> => {
    return {
      ...upstreamWalletActionsL2(),
      sendL2ToL2Message: (args) => sendL2ToL2Message(client, args),
      relayL2ToL2Message: (args) => relayL2ToL2Message(client, args),
      sendSuperchainERC20: (args) => sendSuperchainERC20(client, args),
      sendSuperchainWETH: (args) => sendSuperchainWETH(client, args),
      depositSuperchainWETH: (args) => depositSuperchainWETH(client, args),
      withdrawSuperchainWETH: (args) => withdrawSuperchainWETH(client, args),
      crossChainSendETH: (args) => crossChainSendETH(client, args),
    } as WalletActionsL2<chain, account>
  }
}
