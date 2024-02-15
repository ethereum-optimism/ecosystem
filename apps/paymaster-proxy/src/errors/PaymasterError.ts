import type { RpcRequestError } from 'viem'

// These are the errors that can be proxied and returned to the user
export class PaymasterRpcError extends Error {
  constructor(
    readonly code: number,
    readonly message: string,
  ) {
    super(message)
    this.name = 'PaymasterRpcError'
  }

  static fromViemRpcRequestError(err: RpcRequestError) {
    return new PaymasterRpcError(err.code, err.message)
  }
}

// These are a result of a non-RPC error (ie. HTTP failure), and should not be proxied to the user
export class PaymasterNonRpcError extends Error {
  constructor(readonly underlyingError: Error) {
    super(underlyingError.message)
    this.name = 'PaymasterNonRpcError'
  }

  static fromError(error: Error) {
    return new PaymasterNonRpcError(error)
  }
}
