import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from 'express'

import { JsonRpcError } from '@/errors/JsonRpcError'

export const jsonRpcRequestParseErrorHandler = ((
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err.status === 400 && err instanceof SyntaxError && 'body' in err) {
    // If JSON parsing fails, return a -32700 JSON-RPC error
    return res.json(JsonRpcError.parseError().response())
  }

  next(err)
}) satisfies ErrorRequestHandler
