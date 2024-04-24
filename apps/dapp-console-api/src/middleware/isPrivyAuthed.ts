import bcrypt from 'bcrypt'

import { envVars, PRIVY_TOKEN_COOKIE_KEY } from '@/constants'
import { getEntityByPrivyDid, insertEntity } from '@/models'
import { Trpc } from '@/Trpc'

/** Middleware used for checking if the request has a valid privy token associated with it. */
export const isPrivyAuthed = (trpc: Trpc) => {
  return trpc.middleware(async ({ ctx, next }) => {
    const { req, session } = ctx

    let accessToken = req.cookies[PRIVY_TOKEN_COOKIE_KEY]
    if (!accessToken && req.headers && req.headers['Authorization']) {
      accessToken = parseAuthorizationHeader(
        req.headers['Authorization'] as string,
      )
    }
    console.log('TOK', accessToken)
    if (!accessToken) {
      throw Trpc.handleStatus(401, `user not signed in to privy`)
    }

    const hashedAccessToken = await hashAccessToken(accessToken)

    if (
      !session.user ||
      session.user.privyAccessToken !== hashedAccessToken ||
      session.user.privyAccessTokenExpiration < Date.now()
    ) {
      try {
        const verifiedPrivy = await trpc.privy.verifyAuthToken(accessToken)

        let entity = await getEntityByPrivyDid(
          trpc.database,
          verifiedPrivy.userId,
        )
        if (!entity) {
          entity = await insertEntity(trpc.database, {
            privyDid: verifiedPrivy.userId,
          })
        }

        session.user = {
          privyAccessToken: hashedAccessToken,
          // verifiedPrivy.expiration is in seconds
          privyAccessTokenExpiration: verifiedPrivy.expiration * 1000,
          privyDid: verifiedPrivy.userId,
          entityId: entity.id,
        }
        await session.save()
      } catch (err) {
        trpc.logger.error('error logging user in', err)
        throw Trpc.handleStatus(401, `unable to validate access token`)
      }
    }

    return next()
  })
}

const hashAccessToken = (accessToken: string) => {
  return bcrypt.hash(accessToken, envVars.PRIVY_ACCESS_TOKEN_SALT)
}

const parseAuthorizationHeader = (value: string) => {
  return value.replace('Bearer', '').trim()
}
