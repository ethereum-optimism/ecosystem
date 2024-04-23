import { generateListResponse, zodCreatedAtCursor, zodListRequest } from '@/api'
import { isPrivyAuthed } from '@/middleware'
import {
  getActiveWalletsForEntityByCursor,
  getWalletsByEntityId,
  getWalletVerifications,
} from '@/models'
import { metrics } from '@/monitoring/metrics'
import { Trpc } from '@/Trpc'
import {
  checkIfSanctionedAddress,
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
      const { user } = ctx.session

      const { id: entityId } = await assertUserAuthenticated(
        this.trpc.database,
        user,
      )

      await fetchAndSyncPrivyWallets(
        this.trpc.database,
        this.trpc.privy,
        user!.privyDid,
        entityId,
      ).catch((err) => {
        this.logger?.error(
          {
            err,
            privyDid: user!.privyDid,
            entityId,
          },
          'error fetching and syncing privy wallets',
        )
        metrics.privySyncWalletsErrorCount.inc()
        throw Trpc.handleStatus(500, 'error syncing wallets')
      })
      const wallets = await getWalletsByEntityId(
        this.trpc.database,
        entityId,
      ).catch((err) => {
        this.logger?.error(
          {
            err,
            entityId,
          },
          'error getting wallets by entity id',
        )
        metrics.getWalletsByEntityIdErrorCount.inc()
        throw Trpc.handleStatus(500, 'error syncing wallets')
      })
      const screeningResults = await Promise.all(
        wallets.map((wallet) =>
          checkIfSanctionedAddress({
            db: this.trpc.database,
            entityId,
            address: wallet.address,
          }),
        ),
      ).catch((err) => {
        this.logger?.error(
          {
            err,
            entityId,
          },
          'error screening wallets',
        )
        throw Trpc.handleStatus(500, 'error screening address')
      })

      if (screeningResults.some((result) => !!result)) {
        throw Trpc.handleStatus(401, 'sanctioned address')
      }

      const cbUpdateResults = await updateCbVerificationForAllWallets({
        db: this.trpc.database,
        entityId,
      })
      const failedCbUpdates = cbUpdateResults.filter(
        (result) => result.status === 'rejected',
      ) as PromiseRejectedResult[]
      if (failedCbUpdates.length > 0) {
        this.logger?.error(
          {
            failureReasons: failedCbUpdates.map((update) => update.reason),
            entityId,
          },
          'error updating cb verification for wallets',
        )
      }

      return { success: true }
    })

  /** Syncs cb verification status across all active wallets. */
  public readonly syncCbVerification = 'syncCbVerification' as const
  public readonly syncCbVerificationController = this.trpc.procedure
    .use(isPrivyAuthed(this.trpc))
    .mutation(async ({ ctx }) => {
      const { user } = ctx.session
      const { id: entityId } = await assertUserAuthenticated(
        this.trpc.database,
        user,
      )

      const updateResults = await updateCbVerificationForAllWallets({
        db: this.trpc.database,
        entityId,
      })

      const failedUpdates = updateResults.filter(
        (result) => result.status === 'rejected',
      ) as PromiseRejectedResult[]

      if (failedUpdates.length > 0) {
        this.logger?.error(
          {
            failureReasons: failedUpdates.map((update) => update.reason),
            entityId,
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

        const { id: entityId } = await assertUserAuthenticated(
          this.trpc.database,
          user,
        )

        const activeWallets = await getActiveWalletsForEntityByCursor(
          this.trpc.database,
          entityId,
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

  public readonly walletVerifications = 'walletVerifications' as const
  /** Returns the verifications of the active wallets under an entity. */
  public readonly walletVerificationsController = this.trpc.procedure
    .use(isPrivyAuthed(this.trpc))
    .query(async ({ ctx }) => {
      const { user } = ctx.session
      const { id: entityId } = await assertUserAuthenticated(
        this.trpc.database,
        user,
      )

      const walletVerifications = await getWalletVerifications({
        db: this.trpc.database,
        entityId,
      }).catch((err) => {
        metrics.fetchWalletVerificationsErrorCount.inc()
        this.logger?.error(
          {
            error: err,
            entityId,
          },
          'error fetching wallet verifications from db',
        )
        throw Trpc.handleStatus(500, 'error fetching wallet verifications')
      })

      return { ...walletVerifications }
    })

  public readonly handler = this.trpc.router({
    [this.syncWallets]: this.syncWalletsController,
    [this.listWallets]: this.listWalletsController,
    [this.syncCbVerification]: this.syncCbVerificationController,
    [this.walletVerifications]: this.walletVerificationsController,
  })
}
