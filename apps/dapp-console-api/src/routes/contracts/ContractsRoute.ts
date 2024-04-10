import { isPrivyAuthed } from '@/middleware'
import { getContractsForApp } from '@/models'
import { metrics } from '@/monitoring/metrics'
import { Trpc } from '@/Trpc'

import { Route } from '../Route'

export class ContractsRoute extends Route {
  public readonly name = 'Contracts' as const

  public readonly listContractsForApp = 'listContractsForApp' as const
  /**
   * Returns a list of contracts associated with an app.
   */
  public readonly listContractsForAppController = this.trpc.procedure
    .use(isPrivyAuthed(this.trpc))
    .input(
      this.z.object({
        appId: this.z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const { user } = ctx.session

        if (!user) {
          throw Trpc.handleStatus(401, 'user not authenticated')
        }

        const contracts = await getContractsForApp({
          db: this.trpc.database,
          entityId: user.entityId,
          appId: input.appId,
        })

        return contracts
      } catch (err) {
        metrics.listContractsErrorCount.inc()
        this.logger?.error(
          {
            error: err,
            entityId: ctx.session.user?.entityId,
            privyDid: ctx.session.user?.privyDid,
          },
          'error fetching contracts from db',
        )
        throw Trpc.handleStatus(500, 'error fetching contracts')
      }
    })

  public readonly handler = this.trpc.router({
    [this.listContractsForApp]: this.listContractsForAppController,
  })
}
