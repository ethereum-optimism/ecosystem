import { isPrivyAuthed } from '@/middleware'
import { metrics } from '@/monitoring/metrics'
import { Trpc } from '@/Trpc'
import { fetchAndSyncPrivyWallets } from '@/utils'

import { Route } from '../Route'

export class WalletsRoute extends Route {
  public readonly name = 'wallets' as const

  public readonly syncWallets = 'syncWallets' as const
  public readonly syncWalletsController = this.trpc.procedure
    .use(isPrivyAuthed(this.trpc))
    .mutation(async ({ ctx }) => {
      try {
        const { user } = ctx.session

        await fetchAndSyncPrivyWallets(
          this.trpc.database,
          this.trpc.privy,
          user!.privyDid,
          user!.entityId,
        )

        return { success: true }
      } catch (err) {
        metrics.privySyncWalletsErrorCount.inc()
        this.logger?.error(
          {
            error: err,
            entityId: ctx.session.user?.entityId,
            privyDid: ctx.session.user?.privyDid,
          },
          'error syncing wallets',
        )
        throw Trpc.handleStatus(500, 'error syncing wallets')
      }
    })

  public readonly handler = this.trpc.router({
    [this.syncWallets]: this.syncWalletsController,
  })
}
