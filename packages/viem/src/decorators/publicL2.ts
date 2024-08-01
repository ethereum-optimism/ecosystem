import type { Account, Address, Chain, Client, Transport } from 'viem'
import type { PublicActionsL2 as UpstreamPublicActionsL2 } from 'viem/op-stack'
import { publicActionsL2 as upstreamPublicActionsL2 } from 'viem/op-stack'

import type {
  BuildExecuteL2ToL2MessageParameters,
  BuildExecuteL2ToL2MessageReturnType,
} from '@/actions/buildExecuteL2ToL2Message.js'
import { buildExecuteL2ToL2Message } from '@/actions/buildExecuteL2ToL2Message.js'
import type {
  BuildSendL2ToL2MessageParameters,
  BuildSendL2ToL2MessageReturnType,
} from '@/actions/buildSendL2ToL2Message.js'
import { buildSendL2ToL2Message } from '@/actions/buildSendL2ToL2Message.js'
import type {
  EstimateExecuteL2ToL2MessageGasParameters,
  EstimateExecuteL2ToL2MessageGasReturnType,
} from '@/actions/estimateExecuteL2ToL2MessageGas.js'
import { estimateExecuteL2ToL2MessageGas } from '@/actions/estimateExecuteL2ToL2MessageGas.js'
import type {
  EstimateSendL2ToL2MessageGasParameters,
  EstimateSendL2ToL2MessageGasReturnType,
} from '@/actions/estimateSendL2ToL2MessageGas.js'
import { estimateSendL2ToL2MessageGas } from '@/actions/estimateSendL2ToL2MessageGas.js'

export type PublicActionsL2<
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
> = UpstreamPublicActionsL2 & {
  buildSendL2ToL2Message: <
    chainOverride extends Chain | undefined = undefined,
    accountOverride extends Account | Address | undefined = undefined,
  >(
    parameters: BuildSendL2ToL2MessageParameters<
      chain,
      account,
      chainOverride,
      accountOverride
    >,
  ) => Promise<BuildSendL2ToL2MessageReturnType>
  buildExecuteL2ToL2Message: <
    chainOverride extends Chain | undefined = undefined,
    accountOverride extends Account | Address | undefined = undefined,
  >(
    parameters: BuildExecuteL2ToL2MessageParameters<
      chain,
      account,
      chainOverride,
      accountOverride
    >,
  ) => Promise<BuildExecuteL2ToL2MessageReturnType>
  estimateSendL2ToL2MessageGas: <
    chainOverride extends Chain | undefined = undefined,
  >(
    parameters: EstimateSendL2ToL2MessageGasParameters<
      chain,
      account,
      chainOverride
    >,
  ) => Promise<EstimateSendL2ToL2MessageGasReturnType>
  estimateExecuteL2ToL2MessageGas: <
    chainOverride extends Chain | undefined = undefined,
  >(
    parameters: EstimateExecuteL2ToL2MessageGasParameters<
      chain,
      account,
      chainOverride
    >,
  ) => Promise<EstimateExecuteL2ToL2MessageGasReturnType>
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
      buildSendL2ToL2Message: (args) => buildSendL2ToL2Message(client, args),
      buildExecuteL2ToL2Message: (args) =>
        buildExecuteL2ToL2Message(client, args),
      estimateSendL2ToL2MessageGas: (args) =>
        estimateSendL2ToL2MessageGas(client, args),
      estimateExecuteL2ToL2MessageGas: (args) =>
        estimateExecuteL2ToL2MessageGas(client, args),
    } as PublicActionsL2<chain, account>
  }
}
