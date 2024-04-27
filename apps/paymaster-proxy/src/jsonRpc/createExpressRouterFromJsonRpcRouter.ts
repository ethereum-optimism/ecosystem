import type { NextFunction, Request, Response } from 'express'
import express from 'express'

import { JsonRpcError } from '@/errors/JsonRpcError'
import type { JsonRpcRouter } from '@/jsonRpc/JsonRpcRouter'

export const createExpressRouterFromJsonRpcRouter = (
  jsonRpcRouter: JsonRpcRouter,
) => {
  const router = express.Router()

  router.use('/', (req, res, next) => {
    // reject non-JSON requests
    if (req.headers['content-type'] !== 'application/json') {
      return res.status(400).send()
    }
    next()
  })

  router.use('/', express.json())

  router.post('/', async (req: Request, res: Response) => {
    const result = await jsonRpcRouter.handle(req.body)
    return res.json(result)
  })

  // only handle JSON parsing errors
  router.use(
    '/',
    (err: any, req: Request, res: Response, next: NextFunction) => {
      if (err.status === 400 && err instanceof SyntaxError && 'body' in err) {
        // If JSON parsing fails, return a -32700 JSON-RPC error
        return res.json(JsonRpcError.parseError().response())
      }

      next(err)
    },
  )

  return router
}
