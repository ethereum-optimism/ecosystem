import type { PaymasterRpcError } from '@/errors/PaymasterError'

export const parseErrorCode = -32700 as const
export const invalidRequestErrorCode = -32600 as const
export const methodNotFoundErrorCode = -32601 as const
export const invalidParamsErrorCode = -32602 as const
export const internalErrorCode = -32603 as const

type JsonRpcErrorParams = {
  id?: number | null
  message?: string
}

export class JsonRpcError extends Error {
  constructor(
    readonly errorCode: number,
    readonly params: JsonRpcErrorParams,
  ) {
    super(params.message)
    this.name = 'JsonRpcError'
  }

  static fromPaymasterRpcError(
    error: PaymasterRpcError,
    id: number,
  ): JsonRpcError {
    return new JsonRpcError(error.code, {
      id,
      message: error.message,
    })
  }

  static parseError = ({
    id = null,
    message = 'Parse error',
  }: JsonRpcErrorParams = {}): JsonRpcError => {
    return new JsonRpcError(parseErrorCode, { id, message })
  }

  static invalidRequestError = ({
    id = null,
    message = 'Invalid request',
  }: JsonRpcErrorParams = {}): JsonRpcError => {
    return new JsonRpcError(invalidRequestErrorCode, { id, message })
  }

  static methodNotFoundError = ({
    id = null,
    message = 'Method not found',
  }: JsonRpcErrorParams = {}): JsonRpcError => {
    return new JsonRpcError(methodNotFoundErrorCode, { id, message })
  }

  static invalidParamsError = ({
    id = null,
    message = 'Invalid params',
  }: JsonRpcErrorParams = {}): JsonRpcError => {
    return new JsonRpcError(invalidParamsErrorCode, { id, message })
  }

  static internalError = ({
    id = null,
    message = 'Internal error',
  }: JsonRpcErrorParams = {}): JsonRpcError => {
    return new JsonRpcError(internalErrorCode, { id, message })
  }

  response() {
    return {
      jsonrpc: '2.0' as const,
      id: this.params.id,
      error: {
        code: this.errorCode,
        message: this.params.message,
      },
    }
  }
}
