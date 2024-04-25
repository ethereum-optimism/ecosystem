import bcrypt from 'bcrypt'

import { envVars, PRIVY_TOKEN_COOKIE_KEY } from '@/constants'
import { EntityState, getEntityByPrivyDid, insertEntity } from '@/models'
import { metrics } from '@/monitoring/metrics'
import { Trpc } from '@/Trpc'

/** Middleware used for checking if the request has a valid privy token associated with it. */
export const isPrivyAuthed = (trpc: Trpc) => {
  return trpc.middleware(async ({ ctx, next }) => {
    const { req, session } = ctx

    let accessToken = req.cookies[PRIVY_TOKEN_COOKIE_KEY]
    if (!accessToken && req.headers && req.headers['authorization']) {
      accessToken = parseAuthorizationHeader(
        req.headers['authorization'] as string,
      )
    }

    if (!accessToken) {
      throw Trpc.handleStatus(401, `user not signed in to privy`)
    }

    const hashedAccessToken = await hashAccessToken(accessToken)

    if (
      !session.user ||
      session.user.privyAccessToken !== hashedAccessToken ||
      session.user.privyAccessTokenExpiration < Date.now()
    ) {
      const verifiedPrivy = await trpc.privy
        .verifyAuthToken(accessToken)
        .catch((err) => {
          metrics.privyVerifyAuthTokenErrorCount.inc()
          trpc.logger.error({ err }, 'failed to verify privy did')
          throw Trpc.handleStatus(401, 'invalid privy auth token')
        })

      let entity = await getEntityByPrivyDid(
        trpc.database,
        verifiedPrivy.userId,
      ).catch((err) => {
        metrics.fetchEntityErrorCount.inc()
        trpc.logger.error(
          { err, privyDid: verifiedPrivy.userId },
          'error fetching entity using privy did',
        )
        throw Trpc.handleStatus(500, 'unable to fetch entity using privy did')
      })

      if (entity?.state === EntityState.SANCTIONED) {
        metrics.sanctionedAddressBlocked.inc({ entityId: entity.id })
        throw Trpc.handleStatus(401, 'sanctioned entity')
      }

      if (!entity) {
        entity = await insertEntity(trpc.database, {
          privyDid: verifiedPrivy.userId,
        }).catch((err) => {
          metrics.insertEntityErrorCount.inc()
          trpc.logger.error(
            { err, privyDid: verifiedPrivy.userId },
            'failed to insert new entity',
          )
          throw Trpc.handleStatus(500, 'unable to create entity')
        })
      }

      session.user = {
        privyAccessToken: hashedAccessToken,
        // verifiedPrivy.expiration is in seconds
        privyAccessTokenExpiration: verifiedPrivy.expiration * 1000,
        privyDid: verifiedPrivy.userId,
        entityId: entity.id,
      }
      await session.save().catch((err) => {
        metrics.failedToSaveUserIronSessionErrorCount.inc()
        trpc.logger.error(
          { err, entityId: entity.id },
          'failed to save user iron session',
        )
        throw Trpc.handleStatus(500, 'unable to verify entity')
      })
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
