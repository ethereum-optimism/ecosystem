import type { Context, Next } from 'hono'

import { getVerbs } from '../config/verbs.js'

export async function verbsMiddleware(c: Context, next: Next) {
  try {
    getVerbs()
    await next()
  } catch (error) {
    return c.json({ error: 'Verbs SDK not initialized' }, 500)
  }
}
