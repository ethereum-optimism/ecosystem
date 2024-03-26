import type { RouterCaller } from '@trpc/server'
import { beforeEach, describe, expect, it } from 'vitest'

import {
  createSignedInCaller,
  mockDB,
  mockLogger,
  mockPrivyClient,
  mockUserSession,
} from '@/testhelpers'
import { Trpc } from '@/Trpc'

import { AuthRoute } from './AuthRoute'

describe(AuthRoute.name, () => {
  let trpc: Trpc
  let caller: ReturnType<RouterCaller<AuthRoute['handler']['_def']>>
  const session = mockUserSession({
    entityId: 'id1',
    privyAccessTokenExpiration: Date.now(),
    privyAccessToken: 'accessToken',
    privyDid: 'privy:did',
  })

  beforeEach(() => {
    const privyClient = mockPrivyClient()

    trpc = new Trpc(privyClient, mockLogger, mockDB)
    const route = new AuthRoute(trpc).handler
    caller = createSignedInCaller(route, session)
  })

  it('logoutUser deletes the users session', async () => {
    expect(session.user).toBeDefined()

    await caller.logoutUser()

    expect(session.user).toBeUndefined()
  })
})
