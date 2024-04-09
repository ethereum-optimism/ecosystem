import { generateListResponse, zodCreatedAtCursor, zodListRequest } from '@/api'
import { isPrivyAuthed } from '@/middleware'
import { getActiveWalletsForEntityByCursor } from '@/models'
import { metrics } from '@/monitoring/metrics'
import { Trpc } from '@/Trpc'
import { fetchAndSyncPrivyWallets } from '@/utils'

import { DEFAULT_PAGE_LIMIT } from '../constants'
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

  public readonly listWallets = 'listWallets' as const
  /**
   * Returns a list of wallets associated with the entity.
   */
  public readonly listWalletsController = this.trpc.procedure
    .use(isPrivyAuthed(this.trpc))
    .input(zodListRequest(zodCreatedAtCursor))
    .query(async ({ ctx, input }) => {
      try {
        const { user } = ctx.session
        const limit = input.limit ?? DEFAULT_PAGE_LIMIT

        if (!user) {
          throw Trpc.handleStatus(401, 'user not authenticated')
        }

        const activeWallets = await getActiveWalletsForEntityByCursor(
          this.trpc.database,
          user.entityId,
          limit,
          input.cursor,
        )

        return generateListResponse(activeWallets, limit, input.cursor)
      } catch (err) {
        metrics.listWalletsErrorCount.inc()
        this.logger?.error(
          {
            error: err,
            entityId: ctx.session.user?.entityId,
            privyDid: ctx.session.user?.privyDid,
          },
          'error fetching wallets from db',
        )
        throw Trpc.handleStatus(500, 'error fetching wallets')
      }
    })

  public readonly handler = this.trpc.router({
    [this.syncWallets]: this.syncWalletsController,
    [this.listWallets]: this.listWalletsController,
  })
}
