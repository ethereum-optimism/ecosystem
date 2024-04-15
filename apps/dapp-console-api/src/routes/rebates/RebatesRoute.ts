import { isPrivyAuthed } from '@/middleware'
import { getTotalRebatesClaimedByEntity } from '@/models'
import { metrics } from '@/monitoring/metrics'
import { Trpc } from '@/Trpc'

import { Route } from '../Route'
import { assertUserAuthenticated } from '../utils'

export class RebatesRoute extends Route {
  public readonly name = 'Rebates' as const

  public readonly totalRebatesClaimed = 'totalRebatesClaimed' as const
  public readonly totalRebatesClaimedController = this.trpc.procedure
    .use(isPrivyAuthed(this.trpc))
    .query(async ({ ctx }) => {
      const { user } = ctx.session

      assertUserAuthenticated(user)

      return await getTotalRebatesClaimedByEntity({
        db: this.trpc.database,
        entityId: user.entityId,
      }).catch((err) => {
        metrics.fetchTotalRebatesClaimedErrorCount.inc()
        this.logger?.error(
          {
            error: err,
            entityId: user.entityId,
          },
          'error fetching total rebates claimed from db',
        )
        throw Trpc.handleStatus(500, 'error fetching total rebates claimed')
      })
    })

  public readonly handler = this.trpc.router({
    [this.totalRebatesClaimed]: this.totalRebatesClaimedController,
  })
}
