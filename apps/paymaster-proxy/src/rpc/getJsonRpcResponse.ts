export const getJsonRpcResponse = <T>(id: number, result: T) => {
  return {
    jsonrpc: '2.0',
    id,
    result,
  } as const
}

export type JsonRpcResponse<T> = ReturnType<typeof getJsonRpcResponse<T>>
