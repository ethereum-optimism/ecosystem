import type { Account, Chain, Client, Transport } from 'viem'
import type { WalletActionsL2 as UpstreamWalletActionsL2 } from 'viem/op-stack'
import { walletActionsL2 as upstreamWalletActionsL2 } from 'viem/op-stack'

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
  SendSupERC20Parameters,
  SendSupERC20ReturnType,
} from '@/actions/sendSupERC20.js'
import { sendSupERC20 } from '@/actions/sendSupERC20.js'

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
  sendSupERC20: <chainOverride extends Chain | undefined = undefined>(
    parameters: SendSupERC20Parameters<chain, account, chainOverride>,
  ) => Promise<SendSupERC20ReturnType>
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
      sendSupERC20: (args) => sendSupERC20(client, args),
    } as WalletActionsL2<chain, account>
  }
}
