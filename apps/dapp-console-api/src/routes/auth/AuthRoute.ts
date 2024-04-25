import { metrics } from '@/monitoring/metrics'
import { Trpc } from '@/Trpc'

import { Route } from '../Route'

export class AuthRoute extends Route {
  public readonly name = 'auth' as const

  public readonly logoutUser = 'logoutUser' as const
  public readonly logoutUserController = this.trpc.procedure.mutation(
    async ({ ctx }) => {
      const { session } = ctx

      delete session.user

      await session.save().catch((err) => {
        metrics.logoutUserErrorCount.inc()
        this.logger?.error({ err }, 'failed to logout user')
        throw Trpc.handleStatus(500, 'unable to logout user')
      })

      return { success: true }
    },
  )

  public readonly handler = this.trpc.router({
    [this.logoutUser]: this.logoutUserController,
  })
}
