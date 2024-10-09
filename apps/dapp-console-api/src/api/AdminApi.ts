import * as trpcExpress from '@trpc/server/adapters/express'
import bcrypt from 'bcrypt'
import type { NextFunction, Request, Response, Router } from 'express'
import { getIronSession } from 'iron-session'
import type { Logger } from 'pino'
import * as trpcPlayground from 'trpc-playground/handlers/express'

import { ensureAdmin } from '@/auth'
import type { FaucetAdminRoute } from '@/routes/admin'

import type { SessionData } from '../constants'
import { envVars, sessionOptions } from '../constants'
import { Route } from '../routes'
import type { Trpc } from '../Trpc'

const loginFormCss = [
  'display:flex',
  'align-items:center',
  'justify-content:space-between',
  'flex-direction:column',
  'height: 60px',
]

const loginForm = `
    <form action="/api/admin/login?{queryParams}" method="post" style="${loginFormCss.join(
      ';',
    )}">
        <div>
            <label for="password">Admin Password:</label>
            <input type="password" id="password" name="password">
        </div>
        <div>
            <button type="submit">Login</button>
        </div>
    </form>
`

export type AdminHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => void

export class AdminApi extends Route {
  public readonly name = 'AdminAPI'

  public readonly handler = this.trpc.router({
    [this.routes.faucetAdmin.name]: this.routes.faucetAdmin.handler,
  })

  constructor(
    trpc: Trpc,
    protected readonly routes: {
      readonly faucetAdmin: FaucetAdminRoute
    },
  ) {
    super(trpc)
  }

  public async registerRoutes(router: Router) {
    // login routes
    router.get('/admin/login', this.getLogin())
    router.post('/admin/login', this.postLogin())

    // trpc endpoints
    const trpcHandler = trpcExpress.createExpressMiddleware({
      router: this.handler,
      createContext: this.trpc.createContext,
    })
    router.use('/admin/trpc', ensureAdmin(), trpcHandler)

    // trpc playground
    const playgroundHandler = await trpcPlayground.expressHandler({
      trpcApiEndpoint: `/api/admin/trpc`,
      playgroundEndpoint: `/api/admin/playground`,
      router: this.handler,
      request: {
        superjson: true,
      },
    })
    router.use('/admin/playground', ensureAdmin(), playgroundHandler)
  }

  public readonly setLoggingServer = (logger: Logger) => {
    this.logger = logger
    Object.values(this.routes).forEach((route) => {
      route.setLoggingServer(logger)
    })
  }

  private getLogin(): AdminHandler {
    return (req: Request, res: Response) => {
      res.send(
        loginForm.replace('{queryParams}', this.getRequestQueryParams(req)),
      )
    }
  }

  private postLogin(): AdminHandler {
    return async (req: Request, res: Response) => {
      const { password } = req.body
      const session = await getIronSession<SessionData>(
        req,
        res,
        sessionOptions,
      )

      if (!password) {
        res.status(401).send('Login Failed!')
      }

      const hashedPassword = await this.hashPassword(password)
      if (hashedPassword === envVars.ADMIN_API_PASSWORD) {
        session.admin = {
          isActive: true,
          createdAt: new Date().toUTCString(),
        }
        await session.save()

        const searchParams = new URLSearchParams(
          this.getRequestQueryParams(req),
        )
        const redirectURL = searchParams.get('redirect_url')

        if (redirectURL) {
          res.redirect(redirectURL)
          return
        }

        res.status(200).send('Login Successful!')
      } else {
        res.status(401).send('Login Failed!')
      }
    }
  }

  private getRequestQueryParams(req: Request): string {
    return req.originalUrl.split('?').pop() ?? ''
  }

  private async hashPassword(password: string) {
    return bcrypt.hash(password, envVars.ADMIN_API_SALT!)
  }
}
