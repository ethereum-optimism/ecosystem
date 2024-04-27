export abstract class JsonRpcCastableError extends Error {
  override name = 'JsonRpcCastableError'
  constructor(
    readonly jsonRpcErrorCode: number,
    readonly jsonRpcErrorMessage: string,
  ) {
    super(jsonRpcErrorMessage)
  }
}
