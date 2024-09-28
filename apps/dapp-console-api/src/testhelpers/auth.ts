import type { AnyRouter } from '@trpc/server'
import { createCallerFactory } from '@trpc/server'
import bcrypt from 'bcrypt'
import type { Request, Response } from 'express'
import type { getIronSession } from 'iron-session'

import type { SessionData } from '@/constants'
import { envVars, PRIVY_TOKEN_COOKIE_KEY } from '@/constants'
import type { Session } from '@/constants/session'

import { ENTITY_ID, PRIVY_DID } from './constants'
import { mockUserSession } from './session'

export type AccessTokenLocation = 'header' | 'cookie'

export const mockPrivyAccessToken = 'privy_token'

export const createSignedInCaller = <T extends AnyRouter>({
  router,
  session,
  privyAccessToken,
  tokenLocation = 'cookie',
  ip = '127.0.0.1',
}: {
  router: T
  session: Awaited<ReturnType<typeof getIronSession<SessionData>>>
  privyAccessToken?: string
  tokenLocation?: AccessTokenLocation
  ip?: string | null
}) => {
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
      ip,
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

export type WorldIdSessionType = {
  nullifierHash: string
  isVerified: boolean
  createdAt: string
}

/** Creates a valid session that passes the isPrivyAuthed middleware */
export const validSession = async (worldIdSession?: WorldIdSessionType) => {
  const hashedAccessToken = await bcrypt.hash(
    mockPrivyAccessToken,
    envVars.PRIVY_ACCESS_TOKEN_SALT,
  )

  return mockUserSession(
    {
      entityId: ENTITY_ID,
      privyAccessTokenExpiration: Date.now() + 1000,
      privyAccessToken: hashedAccessToken,
      privyDid: PRIVY_DID,
    },
    worldIdSession,
  )
}
