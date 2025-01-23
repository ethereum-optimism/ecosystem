import type { Account, Chain, Client, Transport } from 'viem'
import type { WalletActionsL2 as OpWalletActionsL2 } from 'viem/op-stack'
import { walletActionsL2 as opWalletActionsL2 } from 'viem/op-stack'

import type {
  SendETHContractReturnType,
  SendETHParameters,
  DepositSuperchainWETHParameters,
  DepositSuperchainWETHReturnType,
  RelayMessageParameters,
  RelayMessageReturnType,
  SendMessageParameters,
  SendMessageReturnType,
  SendSuperchainERC20Parameters,
  SendSuperchainERC20ReturnType,
  WithdrawSuperchainWETHParameters,
  WithdrawSuperchainWETHReturnType,
} from '@/actions/interop/index.js'
import {
  sendETH,
  depositSuperchainWETH,
  relayMessage,
  sendMessage,
  sendSuperchainERC20,
  withdrawSuperchainWETH,
} from '@/actions/interop/index.js'

export type WalletInteropActionsL2<
  TChain extends Chain | undefined = Chain | undefined,
  TAccount extends Account | undefined = Account | undefined,
> = {
  sendMessage: <chainOverride extends Chain | undefined = undefined>(
    parameters: SendMessageParameters<TChain, TAccount, chainOverride>,
  ) => Promise<SendMessageReturnType>
  relayMessage: <chainOverride extends Chain | undefined = undefined>(
    parameters: RelayMessageParameters<TChain, TAccount, chainOverride>,
  ) => Promise<RelayMessageReturnType>
  sendSuperchainERC20: <chainOverride extends Chain | undefined = undefined>(
    parameters: SendSuperchainERC20Parameters<TChain, TAccount, chainOverride>,
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
  sendETH: <chainOverride extends Chain | undefined = undefined>(
    parameters: SendETHParameters<TChain, TAccount, chainOverride>,
  ) => Promise<SendETHContractReturnType>
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
        sendMessage: (args) => sendMessage(client, args),
        relayMessage: (args) => relayMessage(client, args),
        sendSuperchainERC20: (args) => sendSuperchainERC20(client, args),
        depositSuperchainWETH: (args) => depositSuperchainWETH(client, args),
        withdrawSuperchainWETH: (args) => withdrawSuperchainWETH(client, args),
        sendETH: (args) => sendETH(client, args),
      },
    } as WalletActionsL2<chain, account>
  }
}
