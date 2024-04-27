import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'

import { JsonRpcCastableError } from '@/errors/JsonRpcCastableError'
import { processSingleOrMultiple } from '@/helpers/processSingleOrMultiple'
import { createJsonRpcRequestSchema } from '@/schemas/createJsonRpcRequestSchema'

type JsonRpcResponseError = {
  error: {
    code: number
    message: string
  }
}

type JsonRpcResponseResult = {
  result: unknown
}

type JsonRpcResponse = {
  jsonrpc: '2.0'
  id: number | string | null
} & (JsonRpcResponseError | JsonRpcResponseResult)

// General JSON-RPC request schema - doesn't validate the specifics method or params
const genericJsonRpcRequestSchema = createJsonRpcRequestSchema(
  z.string(),
  z.unknown(),
)

export class JsonRpcRouter {
  private methodByName: Record<
    string,
    {
      paramsValidator: z.ZodTypeAny
      handler: Function
    }
  > = {}

  // registers a new handler, no middleware support
  method<T extends z.ZodTypeAny, U>(
    methodName: string,
    paramsValidator: T,
    handler: (params: z.infer<T>) => Promise<U>,
  ) {
    this.methodByName[methodName] = {
      paramsValidator,
      handler,
    }
  }

  async handle(
    request: unknown | unknown[],
  ): Promise<JsonRpcResponse | JsonRpcResponse[]> {
    if (Array.isArray(request) && request.length === 0) {
      return {
        jsonrpc: '2.0',
        id: null,
        error: {
          code: -32600,
          message: 'Invalid request',
        },
      }
    }

    return await processSingleOrMultiple(
      request,
      this.__handleSingle.bind(this),
    )
  }

  private async __handleSingle(request: unknown): Promise<JsonRpcResponse> {
    const genericJsonRpcRequestParseResult =
      genericJsonRpcRequestSchema.safeParse(request)

    if (!genericJsonRpcRequestParseResult.success) {
      const validationError = fromZodError(
        genericJsonRpcRequestParseResult.error,
      )
      return {
        jsonrpc: '2.0',
        id: null,
        error: {
          code: -32600,
          message: `Invalid request: ${validationError.message}`,
        },
      }
    }

    const { method, params, id } = genericJsonRpcRequestParseResult.data

    if (!this.methodByName[method]) {
      return {
        jsonrpc: '2.0',
        id,
        error: {
          code: -32601,
          message: 'Method not found',
        },
      }
    }

    const { handler, paramsValidator } = this.methodByName[method]

    const paramsValidationResult = paramsValidator.safeParse(params)

    if (!paramsValidationResult.success) {
      const validationError = fromZodError(paramsValidationResult.error, {
        maxIssuesInMessage: 1,
      })
      return {
        jsonrpc: '2.0',
        id,
        error: {
          code: -32602,
          message: `Invalid params: ${validationError.message}`,
        },
      }
    }

    let result: unknown
    try {
      result = await handler(params)
    } catch (e) {
      if (e instanceof JsonRpcCastableError) {
        return {
          jsonrpc: '2.0',
          id,
          error: {
            code: e.jsonRpcErrorCode,
            message: e.jsonRpcErrorMessage,
          },
        }
      }

      return {
        jsonrpc: '2.0',
        id,
        error: {
          code: -32603,
          message: 'Internal error',
        },
      }
    }

    return {
      jsonrpc: '2.0',
      id,
      result,
    }
  }
}
