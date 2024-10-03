import type { AppRouter } from '@eth-optimism/interop-indexer'
import type { createTRPCProxyClient } from '@trpc/client'

import type { Trpc } from '@/Trpc'

import { Route } from '../Route'

export class MessagesRoute extends Route {
  public readonly name = 'messages' as const

  public readonly messages = 'messages' as const
  public readonly messagesController = this.trpc.procedure.query(async () => {
    try {
      const result = await this.ponderClient.allXChainMessages.query()
      return result
    } catch (err) {
      console.error('caught ponder error', err)
    }
  })

  public readonly handler = this.trpc.router({
    [this.messages]: this.messagesController,
  })

  constructor(
    trpc: Trpc,
    private readonly ponderClient: ReturnType<
      typeof createTRPCProxyClient<AppRouter>
    >,
  ) {
    super(trpc)
  }
}
