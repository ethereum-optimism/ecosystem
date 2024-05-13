import { updatePrivyCreatedAt } from '@/models'
import { metrics } from '@/monitoring/metrics'
import { Trpc } from '@/Trpc'
import { verifyPrivyAuthAndCreateUserSession } from '@/utils'

import { Route } from '../Route'
import { assertUserAuthenticated } from '../utils'

export class AuthRoute extends Route {
  public readonly name = 'auth' as const

  public readonly loginUser = 'loginUser' as const
  public readonly loginUserController = this.trpc.procedure.mutation(
    async ({ ctx }) => {
      await verifyPrivyAuthAndCreateUserSession(this.trpc, ctx)

      const { session } = ctx

      const entity = await assertUserAuthenticated(
        this.trpc.database,
        session.user,
      )

      if (!entity.privyCreatedAt) {
        const privyUser = await this.trpc.privy
          .getUser(entity.privyDid)
          .catch((err) => {
            metrics.fetchPrivyUserErrorCount.inc()
            this.logger?.error(
              {
                error: err,
                entityId: entity.id,
                privyDid: entity.privyDid,
              },
              'error fetching privy user',
            )
            throw Trpc.handleStatus(500, 'error fetching privy user')
          })

        await updatePrivyCreatedAt({
          db: this.trpc.database,
          entityId: entity.id,
          privyCreatedAt: privyUser.createdAt,
        }).catch((err) => {
          metrics.updatePrivyCreatedAtErrorCount.inc()
          this.logger?.error(
            {
              error: err,
              entityId: entity.id,
              privyDid: entity.privyDid,
            },
            'error updating privy created at on entity',
          )
          throw Trpc.handleStatus(500, 'error updating entity')
        })
      }

      return { entity }
    },
  )

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
    [this.loginUser]: this.loginUserController,
  })
}
