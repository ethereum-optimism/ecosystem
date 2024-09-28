import type { PrivyClient } from '@privy-io/server-auth'
import { type RouterCaller, TRPCError } from '@trpc/server'
import type { Mock } from 'vitest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { Route } from '@/routes'
import {
  createSignedInCaller,
  createSignedOutCaller,
  mockDB,
  mockLogger,
  mockPrivyAccessToken,
  mockUserSession,
} from '@/testhelpers'
import { mockGrowthbookStore } from '@/testhelpers/MockGrowtbookStore'
import { mockPrivyClient } from '@/testhelpers/MockPrivyClient'
import { Trpc } from '@/Trpc'

import { isGithubAuthed } from './isGithubAuthed'

describe('isPrivyAuthed', () => {
  let privyClient: PrivyClient
  let trpc: Trpc
  let handler: TestRoute['handler']
  let signedOutCaller: ReturnType<RouterCaller<TestRoute['handler']['_def']>>
  let signedInCaller: ReturnType<RouterCaller<TestRoute['handler']['_def']>>
  let getUser: Mock

  beforeEach(async () => {
    vi.useFakeTimers()
    privyClient = mockPrivyClient()
    trpc = new Trpc(privyClient, mockLogger, mockDB)
    handler = new TestRoute(trpc).handler
    getUser = (privyClient.getUser as Mock).mockImplementation(async () => ({}))
    signedInCaller = createSignedInCaller({
      router: handler,
      session: mockUserSession({
        privyAccessToken: '0xhdfhdfh',
        privyAccessTokenExpiration: Date.now() + 1000,
        entityId: '1',
        privyDid: 'privy:did',
      }),
    })
    signedOutCaller = createSignedOutCaller(handler)
    mockGrowthbookStore.get.mockImplementation(() => true)
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.useRealTimers()
  })

  it('should pass if enable_github_auth flag is set to false', async () => {
    mockGrowthbookStore.get.mockImplementation((key) =>
      key === 'enable_github_auth' ? false : true,
    )

    await expect(signedInCaller.test()).resolves.not.toThrow()
  })

  it('should handle error when privy user is not logged in', async () => {
    await expect(signedOutCaller.test()).rejects.toEqual(
      new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'User is not logged into privy',
      }),
    )
  })

  it('should pass if user is already signed into privy with github account linked', async () => {
    signedInCaller = createSignedInCaller({
      router: handler,
      session: mockUserSession({
        privyAccessToken: '0xhdfhdfh',
        privyAccessTokenExpiration: Date.now() + 1000,
        entityId: '1',
        privyDid: 'privy:did',
        githubSubject: 'subject',
      }),
      privyAccessToken: `${mockPrivyAccessToken}-new`,
    })

    await expect(signedInCaller.test()).resolves.not.toThrow()
    expect(getUser).not.toBeCalled()
  })

  it('should throw error if privy user has not linked github account', async () => {
    getUser.mockImplementation(async () => ({
      github: undefined,
    }))

    await expect(signedInCaller.test()).rejects.toEqual(
      new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'User has not linked their github',
      }),
    )
    expect(getUser).toBeCalled()
  })

  it('should throw error if session save fails', async () => {
    const session = mockUserSession({
      privyAccessToken: '0xhdfhdfh',
      privyAccessTokenExpiration: Date.now() + 1000,
      entityId: '1',
      privyDid: 'privy:did',
    })
    const caller = createSignedInCaller({ router: handler, session })
    const expectedGithubSubject = '0x123'
    getUser.mockImplementation(async () => ({
      github: { subject: expectedGithubSubject },
    }))
    vi.spyOn(session, 'save').mockImplementation(async () => {
      throw new Error('failed to save session')
    })

    await expect(caller.test()).rejects.toEqual(Trpc.handleStatus(500))
  })

  it('should update the session with the github subject', async () => {
    const session = mockUserSession({
      privyAccessToken: '0xhdfhdfh',
      privyAccessTokenExpiration: Date.now() + 1000,
      entityId: '1',
      privyDid: 'privy:did',
    })
    const caller = createSignedInCaller({ router: handler, session })
    const expectedGithubSubject = '0x123'
    getUser.mockImplementation(async () => ({
      github: { subject: expectedGithubSubject },
    }))

    expect(session.user?.githubSubject).not.toBeDefined()
    await caller.test()

    expect(session.user).toEqual({
      entityId: '1',
      privyAccessToken: '0xhdfhdfh',
      privyAccessTokenExpiration: Date.now() + 1000,
      privyDid: 'privy:did',
      githubSubject: expectedGithubSubject,
    })
    expect(session.save).toBeCalled()
  })
})

class TestRoute extends Route {
  public readonly name = 'testroute' as const

  public readonly test = 'test' as const
  public readonly testController = this.trpc.procedure
    .use(isGithubAuthed(this.trpc, mockGrowthbookStore as any))
    .query(async () => {
      return 'test'
    })

  public readonly handler = this.trpc.router({
    [this.test]: this.testController,
  })
}
