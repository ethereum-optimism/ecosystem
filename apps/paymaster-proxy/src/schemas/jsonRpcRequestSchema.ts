import { z } from 'zod'

export const jsonRpcRequestSchema = z
  .object({
    jsonrpc: z.literal('2.0'),
    id: z.number(),
    method: z.string(),
    params: z.array(z.unknown()),
  })
  .strict()
