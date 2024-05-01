import type { Trpc } from '@/Trpc'
import { verifyPrivyAuthAndCreateUserSession } from '@/utils'

/** Middleware used for checking if the request has a valid privy token associated with it. */
export const isPrivyAuthed = (trpc: Trpc) => {
  return trpc.middleware(async ({ ctx, next }) => {
    await verifyPrivyAuthAndCreateUserSession(trpc, ctx)

    return next()
  })
}
