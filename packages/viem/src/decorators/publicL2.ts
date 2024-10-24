import type { Account, Chain, Client, Transport } from 'viem'
import type { PublicActionsL2 as UpstreamPublicActionsL2 } from 'viem/op-stack'
import { publicActionsL2 as upstreamPublicActionsL2 } from 'viem/op-stack'

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
  SendSupERC20ContractReturnType,
  SendSupERC20Parameters,
} from '@/actions/sendSupERC20.js'
import {
  estimateSendSupERC20Gas,
  simulateSendSupERC20,
} from '@/actions/sendSupERC20.js'

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

  estimateSendSupERC20Gas: <
    TChainOverride extends Chain | undefined = undefined,
  >(
    parameters: SendSupERC20Parameters<TChain, TAccount, TChainOverride>,
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

  simulateSendSupERC20: <TChainOverride extends Chain | undefined = undefined>(
    parameters: SendSupERC20Parameters<TChain, TAccount, TChainOverride>,
  ) => Promise<SendSupERC20ContractReturnType>
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
      estimateSendSupERC20Gas: (args) => estimateSendSupERC20Gas(client, args),
      simulateSendL2ToL2Message: (args) =>
        simulateSendL2ToL2Message(client, args),
      simulateRelayL2ToL2Message: (args) =>
        simulateRelayL2ToL2Message(client, args),
      simulateSendSupERC20: (args) => simulateSendSupERC20(client, args),
    } as PublicActionsL2<TChain, TAccount>
  }
}
