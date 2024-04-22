import { rateLimit } from 'express-rate-limit'
import type { Redis } from 'ioredis'
import { RedisStore } from 'rate-limit-redis'

import { envVars } from '@/constants'

export const getRateLimiter = (redisClient: Redis) =>
  rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    limit: envVars.RATE_LIMIT,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    store: new RedisStore({
      // see https://github.com/express-rate-limit/rate-limit-redis
      // @ts-expect-error - Known issue: the `call` function is not present in @types/ioredis
      sendCommand: (...args: string[]) => redisClient.call(...args),
    }),
  })
