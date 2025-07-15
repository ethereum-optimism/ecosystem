import type { ZodError } from 'zod'

/**
 * Formats Zod validation errors into a readable error message
 * @param error - The Zod error object
 * @returns Formatted error message
 */
export function formatZodError(error: ZodError): string {
  return error.errors
    .map((e) => `{${e.path.join('.')}: ${e.message}}`)
    .join(', ')
}
