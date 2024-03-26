import type { PrivyClient } from '@privy-io/server-auth'
import type { RouterCaller } from '@trpc/server'
import bcrypt from 'bcrypt'
import type { Mock } from 'vitest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { envVars } from '@/constants'
import { Route } from '@/routes'
import {
  configureAuthMocks,
  createSignedInCaller,
  createSignedOutCaller,
  mockDB,
  mockLogger,
  mockPrivyAccessToken,
  mockUserSession,
} from '@/testhelpers'
import { mockPrivyClient } from '@/testhelpers/MockPrivyClient'
import { Trpc } from '@/Trpc'

import { isPrivyAuthed } from './isPrivyAuthed'

describe('isPrivyAuthed', () => {
  let privyClient: PrivyClient
  let trpc: Trpc
  let handler: TestRoute['handler']
  let signedOutCaller: ReturnType<RouterCaller<TestRoute['handler']['_def']>>
  let signedInCaller: ReturnType<RouterCaller<TestRoute['handler']['_def']>>
  let hashedAccessToken: string
  let verifyAuthTokenMock: Mock
  let getEntityMock: Mock
  let insertEntityMock: Mock

  beforeEach(async () => {
    hashedAccessToken = await bcrypt.hash(
      mockPrivyAccessToken,
      envVars.PRIVY_ACCESS_TOKEN_SALT,
    )
    privyClient = mockPrivyClient()
    trpc = new Trpc(privyClient, mockLogger, mockDB)
    handler = new TestRoute(trpc).handler
    ;({ verifyAuthTokenMock, getEntityMock, insertEntityMock } =
      configureAuthMocks(privyClient))
    signedInCaller = createSignedInCaller(handler, mockUserSession())
    signedOutCaller = createSignedOutCaller(handler)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should throw if privy-token cookie is not on request', async () => {
    await expect(signedOutCaller.test()).rejects.toEqual(Trpc.handleStatus(401))
  })

  it(
    'should call to privy to verify token when session does not contain access ' +
      'token',
    async () => {
      await signedInCaller.test()

      expect(verifyAuthTokenMock).toBeCalledWith(mockPrivyAccessToken)
    },
  )

  it('should handle error when privy fails to verify the access token', async () => {
    verifyAuthTokenMock.mockRejectedValue(new Error())

    await expect(signedInCaller.test()).rejects.toEqual(Trpc.handleStatus(401))
  })

  it('should call to privy to verify token when access token changes', async () => {
    signedInCaller = createSignedInCaller(
      handler,
      mockUserSession({
        privyAccessToken: hashedAccessToken,
        privyAccessTokenExpiration: Date.now() + 1000,
        entityId: '1',
        privyDid: 'privy:did',
      }),
      `${mockPrivyAccessToken}-new`,
    )

    await signedInCaller.test()

    expect(verifyAuthTokenMock).toBeCalledWith(`${mockPrivyAccessToken}-new`)
  })

  it('should call to privy if access token on session is expired', async () => {
    signedInCaller = createSignedInCaller(
      handler,
      mockUserSession({
        privyAccessToken: hashedAccessToken,
        privyAccessTokenExpiration: Date.now() - 1000,
        entityId: '1',
        privyDid: 'privy:did',
      }),
    )

    await signedInCaller.test()

    expect(verifyAuthTokenMock).toBeCalledWith(mockPrivyAccessToken)
  })

  it('should update the session with the user', async () => {
    const expectedEntityId = 'entityId1'
    const expectedExpirationTimeSeconds = Date.now() / 1000
    const expectedPrivyDid = 'privy:did'
    const session = mockUserSession()
    const caller = createSignedInCaller(handler, session)
    getEntityMock.mockImplementation(async () => ({ id: expectedEntityId }))
    verifyAuthTokenMock.mockImplementation(async () => ({
      expiration: expectedExpirationTimeSeconds,
      userId: expectedPrivyDid,
    }))

    await caller.test()

    expect(session.user).toEqual({
      entityId: expectedEntityId,
      privyAccessToken: hashedAccessToken,
      privyAccessTokenExpiration: expectedExpirationTimeSeconds * 1000,
      privyDid: expectedPrivyDid,
    })
    expect(session.save).toBeCalled()
  })

  it('should create the entity if it does not exist', async () => {
    const expectedEntityId = 'entityId1'
    const expectedExpirationTimeSeconds = Date.now() / 1000
    const expectedPrivyDid = 'privy:did'
    const session = mockUserSession()
    const caller = createSignedInCaller(handler, session)
    getEntityMock.mockImplementation(async () => undefined)
    insertEntityMock.mockImplementation(async () => ({ id: expectedEntityId }))
    verifyAuthTokenMock.mockImplementation(async () => ({
      expiration: expectedExpirationTimeSeconds,
      userId: expectedPrivyDid,
    }))

    await caller.test()

    expect(insertEntityMock).toBeCalledWith(mockDB, {
      privyDid: expectedPrivyDid,
    })
    expect(session.user).toEqual({
      entityId: expectedEntityId,
      privyAccessToken: hashedAccessToken,
      privyAccessTokenExpiration: expectedExpirationTimeSeconds * 1000,
      privyDid: expectedPrivyDid,
    })
    expect(session.save).toBeCalled()
  })

  it('should not create the entity if it already exists', async () => {
    const expectedEntityId = 'entityId1'
    const expectedExpirationTimeSeconds = Date.now() / 1000
    const expectedPrivyDid = 'privy:did'
    const session = mockUserSession()
    const caller = createSignedInCaller(handler, session)
    getEntityMock.mockImplementation(async () => ({ id: expectedEntityId }))
    verifyAuthTokenMock.mockImplementation(async () => ({
      expiration: expectedExpirationTimeSeconds,
      userId: expectedPrivyDid,
    }))

    await caller.test()

    expect(insertEntityMock).not.toBeCalled()
    expect(getEntityMock).toBeCalledWith(mockDB, expectedPrivyDid)
  })

  it('should not call privy and should not fetch entity if session is valid', async () => {
    const session = mockUserSession({
      privyAccessToken: hashedAccessToken,
      privyAccessTokenExpiration: Date.now() + 1000,
      entityId: 'id1',
      privyDid: 'privy:did',
    })
    const caller = createSignedInCaller(handler, session)

    await caller.test()

    expect(verifyAuthTokenMock).not.toBeCalled()
    expect(getEntityMock).not.toBeCalled()
    expect(insertEntityMock).not.toBeCalled()
    expect(session.save).not.toBeCalled()
  })
})

class TestRoute extends Route {
  public readonly name = 'testroute' as const

  public readonly test = 'test' as const
  public readonly testController = this.trpc.procedure
    .use(isPrivyAuthed(this.trpc))
    .query(async () => {
      return 'test'
    })

  public readonly handler = this.trpc.router({
    [this.test]: this.testController,
  })
}
