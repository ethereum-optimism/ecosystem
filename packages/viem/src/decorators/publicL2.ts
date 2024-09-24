import type { Account, Chain, Client, Transport } from 'viem'
import type { PublicActionsL2 as UpstreamPublicActionsL2 } from 'viem/op-stack'
import { publicActionsL2 as upstreamPublicActionsL2 } from 'viem/op-stack'

import type { ExecuteL2ToL2MessageParameters } from '@/actions/executeL2ToL2Message.js'
import { estimateExecuteL2ToL2MessageGas } from '@/actions/executeL2ToL2Message.js'
import type { SendL2ToL2MessageParameters } from '@/actions/sendL2ToL2Message.js'
import { estimateSendL2ToL2MessageGas } from '@/actions/sendL2ToL2Message.js'

export type PublicActionsL2<
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
> = UpstreamPublicActionsL2 & {
  estimateSendL2ToL2MessageGas: <
    chainOverride extends Chain | undefined = undefined,
  >(
    parameters: SendL2ToL2MessageParameters<chain, account, chainOverride>,
  ) => Promise<bigint>
  estimateExecuteL2ToL2MessageGas: <
    chainOverride extends Chain | undefined = undefined,
  >(
    parameters: ExecuteL2ToL2MessageParameters<chain, account, chainOverride>,
  ) => Promise<bigint>
}

export function publicActionsL2() {
  return <
    transport extends Transport,
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  >(
    client: Client<transport, chain, account>,
  ): PublicActionsL2<chain, account> => {
    return {
      ...upstreamPublicActionsL2(),
      estimateSendL2ToL2MessageGas: (args) =>
        estimateSendL2ToL2MessageGas(client, args),
      estimateExecuteL2ToL2MessageGas: (args) =>
        estimateExecuteL2ToL2MessageGas(client, args),
    } as PublicActionsL2<chain, account>
  }
}
