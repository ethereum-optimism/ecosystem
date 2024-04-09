import type { ZodObject } from 'zod'
import { z } from 'zod'

export const zodCreatedAtCursor = z.object({
  createdAt: z.date(),
  id: z.string(),
})

export const zodNameCursor = z.object({
  name: z.string(),
  id: z.string(),
})

export const zodListRequest = <Cursor extends ZodObject<{}>>(
  cursor: Cursor,
  limit?: number,
) =>
  z.object({
    cursor: cursor.optional(),
    limit: z
      .number()
      .min(0)
      .max(limit ?? 100)
      .optional(),
  })
