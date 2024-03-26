import { metrics } from '@/monitoring/metrics'
import { Trpc } from '@/Trpc'

import { Route } from '../Route'

export class AuthRoute extends Route {
  public readonly name = 'auth' as const

  public readonly logoutUser = 'logoutUser' as const
  public readonly logoutUserController = this.trpc.procedure.mutation(
    async ({ ctx }) => {
      try {
        const { session } = ctx

        delete session.user

        await session.save()

        return { success: true }
      } catch (err) {
        metrics.logoutUserErrorCount.inc()
        this.logger?.error(err, 'error saving user session')
        throw Trpc.handleStatus(500, 'error saving user session')
      }
    },
  )

  public readonly handler = this.trpc.router({
    [this.logoutUser]: this.logoutUserController,
  })
}
