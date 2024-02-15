import z from 'zod'

export const createJsonRpcRequestSchema = <
  K extends z.ZodTypeAny,
  T extends z.ZodTypeAny,
>(
  methodSchema: K,
  paramsSchema: T,
) => {
  return z
    .object({
      jsonrpc: z.literal('2.0'),
      id: z.number(),
      method: methodSchema,
      params: paramsSchema,
    })
    .strict()
}
