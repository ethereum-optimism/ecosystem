import { generateListResponse, zodCreatedAtCursor, zodListRequest } from '@/api'
import { isPrivyAuthed } from '@/middleware'
import { getActiveWalletsForEntityByCursor } from '@/models'
import { metrics } from '@/monitoring/metrics'
import { Trpc } from '@/Trpc'
import {
  fetchAndSyncPrivyWallets,
  updateCbVerificationForAllWallets,
} from '@/utils'

import { DEFAULT_PAGE_LIMIT } from '../constants'
import { Route } from '../Route'
import { assertUserAuthenticated } from '../utils'

export class WalletsRoute extends Route {
  public readonly name = 'wallets' as const

  public readonly syncWallets = 'syncWallets' as const
  public readonly syncWalletsController = this.trpc.procedure
    .use(isPrivyAuthed(this.trpc))
    .mutation(async ({ ctx }) => {
      try {
        const { user } = ctx.session

        assertUserAuthenticated(user)

        await fetchAndSyncPrivyWallets(
          this.trpc.database,
          this.trpc.privy,
          user.privyDid,
          user.entityId,
        )
        const cbUpdateResults = await updateCbVerificationForAllWallets({
          db: this.trpc.database,
          entityId: user.entityId,
        })
        const failedCbUpdates = cbUpdateResults.filter(
          (result) => result.status === 'rejected',
        ) as PromiseRejectedResult[]
        if (failedCbUpdates.length > 0) {
          this.logger?.error(
            {
              failureReasons: failedCbUpdates.map((update) => update.reason),
              entityId: user.entityId,
            },
            'error updating cb verification for wallets',
          )
        }

        return { success: true }
      } catch (err) {
        metrics.privySyncWalletsErrorCount.inc()
      }
    })

  /** Syncs cb verification status across all active wallets. */
  public readonly syncCbVerification = 'syncCbVerification' as const
  public readonly syncCbVerificationController = this.trpc.procedure
    .use(isPrivyAuthed(this.trpc))
    .mutation(async ({ ctx }) => {
      const { user } = ctx.session
      assertUserAuthenticated(user)

      const updateResults = await updateCbVerificationForAllWallets({
        db: this.trpc.database,
        entityId: user.entityId,
      })

      const failedUpdates = updateResults.filter(
        (result) => result.status === 'rejected',
      ) as PromiseRejectedResult[]

      if (failedUpdates.length > 0) {
        this.logger?.error(
          {
            failureReasons: failedUpdates.map((update) => update.reason),
            entityId: user.entityId,
          },
          'error updating cb verification for wallets',
        )
        throw Trpc.handleStatus(500, 'some or all wallets failed to be updated')
      }

      return { success: true }
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

        assertUserAuthenticated(user)

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
    [this.syncCbVerification]: this.syncCbVerificationController,
  })
}
