import { z } from 'zod'

export const zodCursor = z.object({
  createdAt: z.date(),
  id: z.string(),
})

export const zodListRequest = (limit?: number) =>
  z.object({
    cursor: zodCursor.optional(),
    limit: z
      .number()
      .min(0)
      .max(limit ?? 100)
      .optional(),
  })
