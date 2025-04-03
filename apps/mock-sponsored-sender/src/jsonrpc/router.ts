import { z } from "zod"

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

const jsonRpcRequestSchema = z
  .object({
    jsonrpc: z.literal('2.0'),
    id: z.union([z.number().int(), z.string()]),
    method: z.string(),
    params: z.unknown().optional(),
  })
  .strict()
