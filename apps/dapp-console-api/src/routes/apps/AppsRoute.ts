import { generateListResponse, zodListRequest, zodNameCursor } from '@/api'
import { isPrivyAuthed } from '@/middleware'
import { getActiveAppsForEntityByCursor, getContractsForApp } from '@/models'
import { metrics } from '@/monitoring/metrics'
import { Trpc } from '@/Trpc'

import { DEFAULT_PAGE_LIMIT } from '../constants'
import { Route } from '../Route'

export class AppsRoute extends Route {
  public readonly name = 'apps' as const

  public readonly listApps = 'listApps' as const
  /**
   * Returns a list of apps associated with the entity.
   */
  public readonly listAppsController = this.trpc.procedure
    .use(isPrivyAuthed(this.trpc))
    .input(zodListRequest(zodNameCursor))
    .query(async ({ ctx, input }) => {
      try {
        const { user } = ctx.session
        const limit = input.limit ?? DEFAULT_PAGE_LIMIT

        if (!user) {
          throw Trpc.handleStatus(401, 'user not authenticated')
        }

        const activeApps = await getActiveAppsForEntityByCursor({
          db: this.trpc.database,
          entityId: user.entityId,
          limit,
          cursor: input.cursor,
        })

        const activeAppsWithContracts = await Promise.all(
          activeApps.map(async (app) => {
            const contracts = await getContractsForApp({
              db: this.trpc.database,
              entityId: user.entityId,
              appId: app.id,
            })
            return {
              ...app,
              contracts,
            }
          }),
        )

        return generateListResponse(
          activeAppsWithContracts,
          limit,
          input.cursor,
        )
      } catch (err) {
        metrics.listAppsErrorCount.inc()
        this.logger?.error(
          {
            error: err,
            entityId: ctx.session.user?.entityId,
            privyDid: ctx.session.user?.privyDid,
          },
          'error fetching apps from db',
        )
        throw Trpc.handleStatus(500, 'error fetching apps')
      }
    })

  public readonly handler = this.trpc.router({
    [this.listApps]: this.listAppsController,
  })
}
