import z from 'zod'

export const createJsonRpcResponseSchema = <T extends z.ZodTypeAny>(
  resultSchema: T,
) => {
  return z.union([
    z
      .object({
        jsonrpc: z.literal('2.0'),
        id: z.number(),
        result: resultSchema,
      })
      .strict(),
    z
      .object({
        jsonrpc: z.literal('2.0'),
        id: z.number(),
        error: z.object({
          code: z.number(),
          message: z.string(),
        }),
      })
      .strict(),
  ])
}
