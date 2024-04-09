import type { inferAsyncReturnType } from '@trpc/server'
import { initTRPC, TRPCError } from '@trpc/server'
import type * as trpcExpress from '@trpc/server/adapters/express'
import superjson from 'superjson'
import { ZodError } from 'zod'

import { castZodToTrpcError } from '@/helpers/castZodToTrpcError'

const createContext = async ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {
  return { req, res }
}

/**
 * TRPC is a typesafe way of a making an api server and a client
 * The typescript types are shared between the two keeping them in sync
 * The strength of trpc is how quickly you can add new endpoints so
 */
export class Trpc {
  public readonly createContext = createContext

  /**
   * @see https://trpc.io/docs/v10/router
   */
  public readonly router = this.trpc.router
  /**
   * @see https://trpc.io/docs/v10/merging-routers
   */
  public readonly mergeRouters = this.trpc.mergeRouters
  /**
   * @see https://trpc.io/docs/v10/procedures
   **/
  public readonly procedure = this.trpc.procedure
  /**
   * @see https://trpc.io/docs/v10/middlewares
   */
  public readonly middleware = this.trpc.middleware

  constructor(
    private readonly trpc = initTRPC
      // @see https://trpc.io/docs/server/context
      .context<inferAsyncReturnType<typeof createContext>>()
      .create({
        /**
         * @see https://trpc.io/docs/v10/data-transformers
         */
        transformer: superjson,
        errorFormatter: (opts) => {
          const { shape, error } = opts

          if (error.code === 'BAD_REQUEST' && error.cause instanceof ZodError) {
            return castZodToTrpcError(error.cause, shape)
          }

          return shape
        },
      }),
  ) {}

  /**
   * Returns the correct trpc status code for a given http status code
   * Suprised this doesn't exist in trpc yet
   * @see https://trpc.io/docs/v10/server/error-handling#error-codes
   */
  static readonly handleStatus = (statusCode: number, cause?: string) => {
    // BAD_REQUEST	The server cannot or will not process the request due to something that is perceived to be a client error.	400
    // UNAUTHORIZED	The client request has not been completed because it lacks valid authentication credentials for the requested resource.	401
    // FORBIDDEN	The server was unauthorized to access a required data source, such as a REST API.	403
    // NOT_FOUND	The server cannot find the requested resource.	404
    // TIMEOUT	The server would like to shut down this unused connection.	408
    // CONFLICT	The server request resource conflict with the current state of the target resource.	409
    // PRECONDITION_FAILED	Access to the target resource has been denied.	412
    // PAYLOAD_TOO_LARGE	Request entity is larger than limits defined by server.	413
    // METHOD_NOT_SUPPORTED	The server knows the request method, but the target resource doesn't support this method.	405
    // UNPROCESSABLE_CONTENT The server understands the request method, and the request entity is correct, but the server was unable to process it. 422
    // TOO_MANY_REQUESTS The rate limit has been exceeded or too many requests are being sent to the server. 429
    // CLIENT_CLOSED_REQUEST	Access to the resource has been denied.	499
    // INTERNAL_SERVER_ERROR	An unspecified error occurred.	500
    if (statusCode === 200) {
      return
    }
    if (statusCode === 400) {
      return new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Bad request',
        cause,
      })
    }
    if (statusCode === 401) {
      return new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Unauthorized',
        cause,
      })
    }
    if (statusCode === 403) {
      return new TRPCError({
        code: 'FORBIDDEN',
        message: 'Forbidden',
        cause,
      })
    }
    if (statusCode === 404) {
      return new TRPCError({
        code: 'NOT_FOUND',
        message: 'Not found',
        cause,
      })
    }
    if (statusCode === 408) {
      return new TRPCError({
        code: 'TIMEOUT',
        message: 'Timeout',
        cause,
      })
    }
    if (statusCode === 409) {
      return new TRPCError({
        code: 'CONFLICT',
        message: 'Conflict',
        cause,
      })
    }
    if (statusCode === 412) {
      return new TRPCError({
        code: 'PRECONDITION_FAILED',
        message: 'Precondition failed',
        cause,
      })
    }
    if (statusCode === 413) {
      return new TRPCError({
        code: 'PAYLOAD_TOO_LARGE',
        message: 'Payload too large',
        cause,
      })
    }
    if (statusCode === 405) {
      return new TRPCError({
        code: 'METHOD_NOT_SUPPORTED',
        message: 'Method not supported',
        cause,
      })
    }
    if (statusCode === 422) {
      return new TRPCError({
        code: 'UNPROCESSABLE_CONTENT',
        message:
          'The server understands the request method, and the request entity is correct, but the server was unable to process it.',
        cause,
      })
    }
    if (statusCode === 429) {
      return new TRPCError({
        code: 'TOO_MANY_REQUESTS',
        message:
          'The rate limit has been exceeded or too many requests are being sent to the server.',
        cause,
      })
    }
    if (statusCode === 499) {
      return new TRPCError({
        code: 'CLIENT_CLOSED_REQUEST',
        message: 'Client closed request',
        cause,
      })
    }
    if (statusCode === 500) {
      return new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error',
        cause,
      })
    }
  }
}
