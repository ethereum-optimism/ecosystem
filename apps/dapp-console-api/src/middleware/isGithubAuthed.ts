import { TRPCError } from '@trpc/server'

import type { GrowthbookStore } from '@/growthbook'
import { metrics } from '@/monitoring/metrics'
import { Trpc } from '@/Trpc'

/** Middleware used for checking if the request is from a privy user with a github account linked. */
export const isGithubAuthed = (
  trpc: Trpc,
  growthBookStore: GrowthbookStore,
) => {
  return trpc.middleware(async ({ ctx, next }) => {
    const { session } = ctx

    if (!growthBookStore.get('enable_github_auth')) {
      return next()
    }

    if (!session.user || !session.user.privyDid) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'User is not logged into privy',
      })
    }

    if (!!session.user.githubSubject) {
      return next()
    }

    const user = await trpc.privy
      .getUser(session.user.privyDid)
      .catch((err) => {
        metrics.fetchPrivyUserErrorCount.inc()
        trpc.logger?.error(
          {
            error: err,
            entityId: session.user?.entityId,
            privyDid: session.user?.privyDid,
          },
          'error fetching privy user',
        )
        throw Trpc.handleStatus(500, 'error fetching privy user')
      })

    if (!user.github) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'User has not linked their github',
      })
    }

    session.user.githubSubject = user.github.subject
    await session.save().catch((err) => {
      metrics.failedToSaveUserIronSessionErrorCount.inc()
      trpc.logger.error(
        { err, entityId: session.user?.entityId },
        'failed to save github subject to user iron session',
      )
      throw Trpc.handleStatus(500, 'unable to verify github auth')
    })

    return next()
  })
}
