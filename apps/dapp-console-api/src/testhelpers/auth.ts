import type { PrivyClient } from '@privy-io/server-auth'
import type { AnyRouter } from '@trpc/server'
import { createCallerFactory } from '@trpc/server'
import type { Request, Response } from 'express'
import type { getIronSession } from 'iron-session'
import { type Mock, vi } from 'vitest'

import type { SessionData } from '@/constants'
import { PRIVY_TOKEN_COOKIE_KEY } from '@/constants'
import type { Session } from '@/constants/session'
import { getEntity, insertEntity } from '@/models'

vi.mock('../models', async () => ({
  // @ts-ignore - importActual returns unknown
  ...(await vi.importActual('../models')),
  getEntity: vi.fn().mockImplementation(async () => undefined),
  insertEntity: vi.fn().mockImplementation(async () => undefined),
}))

export const mockPrivyAccessToken = 'privy_token'

export const createSignedInCaller = <T extends AnyRouter>(
  router: T,
  session: Awaited<ReturnType<typeof getIronSession<SessionData>>>,
  privyAccessToken?: string,
) => {
  const callerFactory = createCallerFactory()
  const createCaller = callerFactory(router)
  return createCaller({
    req: {
      cookies: {
        [PRIVY_TOKEN_COOKIE_KEY]: privyAccessToken || mockPrivyAccessToken,
      } as any,
    } as Request,
    res: {} as Response,
    session: session,
  })
}

export const createSignedOutCaller = <T extends AnyRouter>(router: T) => {
  const callerFactory = createCallerFactory()
  const createCaller = callerFactory(router)
  return createCaller({
    req: {
      cookies: {},
    } as Request,
    res: {} as Response,
    session: {} as Session,
  })
}

/** Sets up the mocks required for authentication. */
export const configureAuthMocks = (privyClient: PrivyClient) => {
  const verifyAuthTokenMock = privyClient.verifyAuthToken as Mock
  verifyAuthTokenMock.mockImplementation(async () => ({}))
  const getEntityMock = getEntity as Mock
  getEntityMock.mockImplementation(async () => ({}))
  const insertEntityMock = insertEntity as Mock
  insertEntityMock.mockImplementation(async () => ({}))
  return {
    verifyAuthTokenMock,
    getEntityMock,
    insertEntityMock,
  }
}
