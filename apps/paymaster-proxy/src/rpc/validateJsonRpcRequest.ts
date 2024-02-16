import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'

import { JsonRpcError } from '@/errors/JsonRpcError'
import { createJsonRpcRequestSchema } from '@/schemas/createJsonRpcRequestSchema'
import { supportedPaymasterRequestSchema } from '@/schemas/supportedPaymasterRequestSchema'

// General JSON-RPC request schema - doesn't validate the specifics method or params
const generalJsonRpcRequestSchema = createJsonRpcRequestSchema(
  z.string(),
  z.unknown(),
)

// Validates JSON-RPC request
// 1. First validates the structure of the request to make sure it satisfies the JSON-RPC 2.0 spec
// 2. Then does application specific validation
export const validateJsonRpcRequest = (jsonRpcRequest: unknown) => {
  const generalJsonRpcRequestParseResult =
    generalJsonRpcRequestSchema.safeParse(jsonRpcRequest)

  if (!generalJsonRpcRequestParseResult.success) {
    const validationError = fromZodError(generalJsonRpcRequestParseResult.error)
    return {
      success: false as const,
      error: JsonRpcError.invalidRequestError({
        message: `Invalid request: ${validationError.message}`,
      }),
    }
  }

  const supportedRequestSchemaParseResult =
    supportedPaymasterRequestSchema.safeParse(
      generalJsonRpcRequestParseResult.data,
    )

  if (!supportedRequestSchemaParseResult.success) {
    const { error } = supportedRequestSchemaParseResult
    const validationError = fromZodError(error, {
      maxIssuesInMessage: 1,
    })
    if (error.issues[0].path[0] === 'method') {
      return {
        success: false as const,
        error: JsonRpcError.methodNotFoundError({
          id: generalJsonRpcRequestParseResult.data.id,
          message: `Method not found: ${validationError.message}`,
        }),
      }
    }

    return {
      success: false as const,
      error: JsonRpcError.invalidParamsError({
        id: generalJsonRpcRequestParseResult.data.id,
        message: `Invalid params: ${validationError.message}`,
      }),
    }
  }

  return {
    success: true as const,
    data: supportedRequestSchemaParseResult.data,
  }
}
