import type { NextFunction, Request, Response } from 'express'
import { getIronSession } from 'iron-session'

import type { SessionData } from '../constants'
import { envVars, sessionOptions } from '../constants'

export const ensureAdmin = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const session = await getIronSession<SessionData>(req, res, sessionOptions)

    if (envVars.DEPLOYMENT_ENV === 'development') {
      next()
    } else if (session.admin?.isActive) {
      next()
    } else {
      res.redirect(`/api/admin/login?redirect_url=${req.originalUrl}`)
    }
  }
}
