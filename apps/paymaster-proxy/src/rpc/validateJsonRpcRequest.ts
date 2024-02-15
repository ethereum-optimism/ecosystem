import { fromZodError } from 'zod-validation-error'

import { JsonRpcError } from '@/errors/JsonRpcError'
import { jsonRpcRequestSchema } from '@/schemas/jsonRpcRequestSchema'
import { supportedPaymasterRequestSchema } from '@/schemas/supportedPaymasterRequestSchema'

export const validateJsonRpcRequest = (jsonRpcRequest: unknown) => {
  const jsonRpcRequestParseResult =
    jsonRpcRequestSchema.safeParse(jsonRpcRequest)

  if (!jsonRpcRequestParseResult.success) {
    const validationError = fromZodError(jsonRpcRequestParseResult.error)
    return {
      success: false as const,
      error: JsonRpcError.invalidRequestError({
        message: `Invalid request: ${validationError.message}`,
      }),
    }
  }

  const supportedRequestSchemaParseResult =
    supportedPaymasterRequestSchema.safeParse(jsonRpcRequestParseResult.data)

  if (!supportedRequestSchemaParseResult.success) {
    const { error } = supportedRequestSchemaParseResult
    const validationError = fromZodError(error, {
      maxIssuesInMessage: 1,
    })
    if (error.issues[0].path[0] === 'method') {
      return {
        success: false as const,
        error: JsonRpcError.methodNotFoundError({
          id: jsonRpcRequestParseResult.data.id,
          message: `Method not found: ${validationError.message}`,
        }),
      }
    }

    return {
      success: false as const,
      error: JsonRpcError.invalidParamsError({
        id: jsonRpcRequestParseResult.data.id,
        message: `Invalid params: ${validationError.message}`,
      }),
    }
  }

  return {
    success: true as const,
    data: supportedRequestSchemaParseResult.data,
  }
}
