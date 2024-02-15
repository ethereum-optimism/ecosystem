import z from 'zod'

export const createJsonRpcRequestSchema = <
  K extends string,
  T extends z.ZodTuple,
>(
  methodName: K,
  paramsSchema: T,
) => {
  return z
    .object({
      jsonrpc: z.literal('2.0'),
      id: z.number(),
      method: z.literal(methodName),
      params: paramsSchema,
    })
    .strict()
}
