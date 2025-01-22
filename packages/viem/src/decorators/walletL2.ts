import type { Account, Chain, Client, Transport } from 'viem'
import type { WalletActionsL2 as OpWalletActionsL2 } from 'viem/op-stack'
import { walletActionsL2 as opWalletActionsL2 } from 'viem/op-stack'

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

export type WalletInteropActionsL2<
  TChain extends Chain | undefined = Chain | undefined,
  TAccount extends Account | undefined = Account | undefined,
> = {
  sendL2ToL2Message: <chainOverride extends Chain | undefined = undefined>(
    parameters: SendL2ToL2MessageParameters<TChain, TAccount, chainOverride>,
  ) => Promise<SendL2ToL2MessageReturnType>
  relayL2ToL2Message: <chainOverride extends Chain | undefined = undefined>(
    parameters: RelayL2ToL2MessageParameters<TChain, TAccount, chainOverride>,
  ) => Promise<RelayL2ToL2MessageReturnType>
  sendSuperchainERC20: <chainOverride extends Chain | undefined = undefined>(
    parameters: SendSuperchainERC20Parameters<TChain, TAccount, chainOverride>,
  ) => Promise<SendSuperchainERC20ReturnType>
  sendSuperchainWETH: <chainOverride extends Chain | undefined = undefined>(
    parameters: SendSuperchainWETHParameters<TChain, TAccount, chainOverride>,
  ) => Promise<SendSuperchainERC20ReturnType>
  depositSuperchainWETH: <chainOverride extends Chain | undefined = undefined>(
    parameters: DepositSuperchainWETHParameters<
      TChain,
      TAccount,
      chainOverride
    >,
  ) => Promise<DepositSuperchainWETHReturnType>
  withdrawSuperchainWETH: <chainOverride extends Chain | undefined = undefined>(
    parameters: WithdrawSuperchainWETHParameters<
      TChain,
      TAccount,
      chainOverride
    >,
  ) => Promise<WithdrawSuperchainWETHReturnType>
  crossChainSendETH: <chainOverride extends Chain | undefined = undefined>(
    parameters: CrossChainSendETHParameters<TChain, TAccount, chainOverride>,
  ) => Promise<CrossChainSendETHContractReturnType>
}

export type WalletActionsL2<
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
> = OpWalletActionsL2<chain, account> & {
  /** interop actions scoped under this member */
  interop: WalletInteropActionsL2<chain, account>
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
      ...opWalletActionsL2(),
      interop: {
        sendL2ToL2Message: (args) => sendL2ToL2Message(client, args),
        relayL2ToL2Message: (args) => relayL2ToL2Message(client, args),
        sendSuperchainERC20: (args) => sendSuperchainERC20(client, args),
        sendSuperchainWETH: (args) => sendSuperchainWETH(client, args),
        depositSuperchainWETH: (args) => depositSuperchainWETH(client, args),
        withdrawSuperchainWETH: (args) => withdrawSuperchainWETH(client, args),
        crossChainSendETH: (args) => crossChainSendETH(client, args),
      },
    } as WalletActionsL2<chain, account>
  }
}
