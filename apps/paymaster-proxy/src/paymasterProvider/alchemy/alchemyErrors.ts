import type { HttpRequestError } from 'viem'
import { z } from 'zod'

import { JsonRpcCastableError } from '@/errors/JsonRpcCastableError'
import { createJsonStringSchema } from '@/schemas/createJsonStringSchema'

export const alchemyJsonRpcHttpRequestErrorDetailsSchema =
  createJsonStringSchema(
    z.object({
      code: z.number(),
      message: z.string(),
    }),
  )

export const isHttpRequestError = (e: unknown): e is HttpRequestError => {
  return (e as any).name === 'HttpRequestError'
}

// Directly returns the same message and code as the rpc error from the Alchemy provider
export class AlchemySponsorUserOperationProxiedError extends JsonRpcCastableError {
  constructor(
    code: number,
    message: string,
    readonly alchemyPolicyId: string,
  ) {
    super(code, message)
  }
}

// Directly returns the same message and code as the rpc error from the Alchemy provider
export class AlchemyRequestPaymasterAndDataProxiedError extends JsonRpcCastableError {
  constructor(
    code: number,
    message: string,
    readonly alchemyPolicyId: string,
  ) {
    super(code, message)
  }
}
