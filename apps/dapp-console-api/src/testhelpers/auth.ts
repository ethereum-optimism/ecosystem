import type { AnyRouter } from '@trpc/server'
import { createCallerFactory } from '@trpc/server'
import bcrypt from 'bcrypt'
import type { Request, Response } from 'express'
import type { getIronSession } from 'iron-session'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Mock } from 'vitest'

import type { SessionData } from '@/constants'
import { envVars, PRIVY_TOKEN_COOKIE_KEY } from '@/constants'
import type { Session } from '@/constants/session'

import { mockUserSession } from './session'

export type AccessTokenLocation = 'header' | 'cookie'

export const mockPrivyAccessToken = 'privy_token'

export const createSignedInCaller = <T extends AnyRouter>(
  router: T,
  session: Awaited<ReturnType<typeof getIronSession<SessionData>>>,
  privyAccessToken?: string,
  tokenLocation: AccessTokenLocation = 'cookie',
) => {
  const callerFactory = createCallerFactory()
  const createCaller = callerFactory(router)

  const headers: Record<string, string> = {}
  const cookies: Record<string, string> = {}

  if (tokenLocation === 'cookie') {
    cookies[PRIVY_TOKEN_COOKIE_KEY] = privyAccessToken || mockPrivyAccessToken
  }

  if (tokenLocation === 'header') {
    headers['authorization'] = `Bearer ${
      privyAccessToken || mockPrivyAccessToken
    }`
  }

  return createCaller({
    req: {
      headers,
      cookies,
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

/** Creates a valid session that passes the isPrivyAuthed middleware */
export const validSession = async () => {
  const hashedAccessToken = await bcrypt.hash(
    mockPrivyAccessToken,
    envVars.PRIVY_ACCESS_TOKEN_SALT,
  )

  return mockUserSession({
    entityId: 'id1',
    privyAccessTokenExpiration: Date.now() + 1000,
    privyAccessToken: hashedAccessToken,
    privyDid: 'privy:did',
  })
}
