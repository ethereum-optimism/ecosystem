import type { DefaultErrorShape } from '@trpc/server'
import type { ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'

// formats 400 Bad Request validation errors to a trpc error
export const castZodToTrpcError = (
  error: ZodError,
  shape: DefaultErrorShape,
) => {
  const validationError = fromZodError(error)
  return {
    code: shape.code,
    message: validationError.message,
    data: {
      code: shape.data.code,
      httpStatus: shape.data.httpStatus,
      path: shape.data.path,
      validationIssues: validationError.details,
    },
  }
}
