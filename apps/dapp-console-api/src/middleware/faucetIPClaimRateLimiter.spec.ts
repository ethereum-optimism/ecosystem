import { type RouterCaller, TRPCError } from '@trpc/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { Route } from '@/routes'
import {
  createSignedInCaller,
  mockDB,
  mockLogger,
  mockRedisCache,
  mockUserSession,
} from '@/testhelpers'
import { mockGrowthbookStore } from '@/testhelpers/MockGrowtbookStore'
import { mockPrivyClient } from '@/testhelpers/MockPrivyClient'
import { Trpc } from '@/Trpc'

import { faucetIPClaimRateLimiter } from './faucetIPClaimRateLimiter'

vi.mock('ioredis')
vi.mock('@/constants', async () => ({
  // @ts-ignore - importActual returns unknown
  ...(await vi.importActual('@/constants')),
  envVars: {
    FAUCET_IP_RATE_LIMIT: 1,
  },
}))

describe('faucetIPClaimRateLimiter', () => {
  let handler: TestRoute['handler']
  let signedInCaller: ReturnType<RouterCaller<TestRoute['handler']['_def']>>

  beforeEach(async () => {
    const privyClient = mockPrivyClient()
    const trpc = new Trpc(privyClient, mockLogger, mockDB)
    handler = new TestRoute(trpc).handler
    signedInCaller = createSignedInCaller({
      router: handler,
      session: mockUserSession(),
    })
    mockGrowthbookStore.get.mockImplementation(() => true)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should pass if under claim rate', async () => {
    mockRedisCache.getItem.mockImplementation(async () => null)

    await expect(signedInCaller.test()).resolves.not.toThrow()
  })

  it('should pass if growthbook flag is off claim rate', async () => {
    mockGrowthbookStore.get.mockImplementation(() => false)
    mockRedisCache.getItem.mockImplementation(async () => BigInt(1))

    await expect(signedInCaller.test()).resolves.not.toThrow()
  })

  it('should throw error when max requests exceeded', async () => {
    mockRedisCache.getItem.mockImplementation(async () => BigInt(1))

    await expect(signedInCaller.test()).rejects.toEqual(
      new TRPCError({
        code: 'TOO_MANY_REQUESTS',
        message: 'Too many faucet claims',
      }),
    )
  })

  it('should throw error when ip address is undefined', async () => {
    const caller = createSignedInCaller({
      router: handler,
      session: mockUserSession(),
      ip: null,
    })

    await expect(caller.test()).rejects.toEqual(
      new TRPCError({
        code: 'BAD_REQUEST',
        message: 'No ip address on request',
      }),
    )
  })
})

class TestRoute extends Route {
  public readonly name = 'testroute' as const

  public readonly test = 'test' as const
  public readonly testController = this.trpc.procedure
    .use(
      faucetIPClaimRateLimiter(
        this.trpc,
        mockGrowthbookStore as any,
        mockRedisCache as any,
      ),
    )
    .query(async () => {
      return 'test'
    })

  public readonly handler = this.trpc.router({
    [this.test]: this.testController,
  })
}
