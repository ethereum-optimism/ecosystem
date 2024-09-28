import { envVars } from '@/constants'

import type { RedisCache } from './redis'

const getFaucetIPRateLimitKey = (ip: string) => `faucet-ip-rate-limit:${ip}`

export const getFaucetIPClaimRate = async (
  redisCache: RedisCache,
  ip: string,
) => redisCache.getItem<number>(getFaucetIPRateLimitKey(ip))

export const incrementFaucetIPClaimRate = async (
  redisCache: RedisCache,
  ip: string,
) =>
  redisCache.incrementItem({
    key: getFaucetIPRateLimitKey(ip),
    ttlInSeconds: envVars.FAUCET_IP_RATE_LIMIT_WINDOW_SECS,
  })
