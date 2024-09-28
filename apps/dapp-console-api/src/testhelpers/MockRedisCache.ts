import type { MockedFunction } from 'vitest'
import { vi } from 'vitest'

import type { RedisCache } from '@/utils/redis'

export const mockRedisCache = {
  setItem: vi.fn() as MockedFunction<RedisCache['setItem']>,
  getItem: vi.fn() as MockedFunction<RedisCache['getItem']>,
  deleteItem: vi.fn() as MockedFunction<RedisCache['deleteItem']>,
}
