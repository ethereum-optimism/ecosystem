import bcrypt from 'bcrypt'

import { envVars, PRIVY_TOKEN_COOKIE_KEY } from '@/constants'
import { getEntity, insertEntity } from '@/models'
import { Trpc } from '@/Trpc'

/** Middleware used for checking if the request has a valid privy token associated with it. */
export const isPrivyAuthed = (trpc: Trpc) => {
  return trpc.middleware(async ({ ctx, next }) => {
    const { req, session } = ctx
    const cookieAccessToken = req.cookies[PRIVY_TOKEN_COOKIE_KEY]

    if (!cookieAccessToken) {
      throw Trpc.handleStatus(401, `user not signed in to privy`)
    }

    const hashedCookieAccessToken = await hashAccessToken(cookieAccessToken)

    if (
      !session.user ||
      session.user.privyAccessToken !== hashedCookieAccessToken ||
      session.user.privyAccessTokenExpiration < Date.now()
    ) {
      try {
        const verifiedPrivy =
          await trpc.privy.verifyAuthToken(cookieAccessToken)
        // TODO: sync privy linked accounts

        let entity = await getEntity(trpc.database, verifiedPrivy.userId)
        if (!entity) {
          entity = await insertEntity(trpc.database, {
            privyDid: verifiedPrivy.userId,
          })
        }

        session.user = {
          privyAccessToken: hashedCookieAccessToken,
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
