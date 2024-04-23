import { type FrameRequest, getFrameMessage } from '@coinbase/onchainkit/frame'
import type { Context, Next } from 'hono'

import type { Env } from '@/env'

// throws error if not verified
export const withFrameVerification = async (
  c: Context<{ Bindings: Env }>,
  next: Next,
) => {
  if (c.env.ENVIRONMENT === 'DEV') {
    await next()
    return
  }

  if (c.req.method !== 'POST') {
    await next()
    return
  }

  const data = await c.req.json()

  if (!data) {
    throw Error('No frame message')
  }

  const { isValid } = await getFrameMessage(data as FrameRequest, {
    neynarApiKey: c.env.NEYNAR_API_KEY,
  })

  if (!isValid) {
    throw Error('Frame message verification failed')
  }

  await next()
}
