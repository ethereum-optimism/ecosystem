import { z } from 'zod'

// Create a schema that parses a JSON string and then validates the parsed object
export const createJsonStringSchema = <T extends z.ZodTypeAny>(
  objectSchema: T,
) =>
  z
    .string()
    .transform((x, ctx) => {
      try {
        return JSON.parse(x)
      } catch (e) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: e.message,
        })
        return z.NEVER
      }
    })
    .pipe(objectSchema)
