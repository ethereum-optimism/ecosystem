import { TRPCError } from '@trpc/server'
import type { Logger } from 'pino'

import { envVars } from '@/constants'
import type { GrowthbookStore } from '@/growthbook'
import { metrics } from '@/monitoring/metrics'
import type { Trpc } from '@/Trpc'
import { getFaucetIPClaimRate } from '@/utils'
import type { RedisCache } from '@/utils/redis'

/** Middleware used for checking if a user is under the faucet claim rate limit */
export const faucetIPClaimRateLimiter = (
  trpc: Trpc,
  growthBookStore: GrowthbookStore,
  redisCache: RedisCache,
  logger?: Logger,
) => {
  return trpc.middleware(async ({ ctx, next }) => {
    const { ip } = ctx.req
    const enableFaucetRateLimit = growthBookStore.get(
      'enable_faucet_rate_limit',
    )
    console.log('enable_faucet_rate_limit:', enableFaucetRateLimit)
    if (!enableFaucetRateLimit) {
      return next()
    }

    if (!ip) {
      logger?.error('faucet encountered a request with an undefined ip address')
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'No ip address on request',
      })
    }

    const requestCount = await getFaucetIPClaimRate(redisCache, ip)
    if (requestCount && requestCount >= envVars.FAUCET_IP_RATE_LIMIT) {
      logger?.warn({ ip }, 'faucet request rate limited')
      metrics.faucetRateLimitCount.inc()
      throw new TRPCError({
        code: 'TOO_MANY_REQUESTS',
        message: 'Too many faucet claims',
      })
    }

    return next()
  })
}
