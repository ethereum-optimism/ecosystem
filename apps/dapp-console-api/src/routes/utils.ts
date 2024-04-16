import type { SessionData } from '@/constants'
import { Trpc } from '@/Trpc'

export function assertUserAuthenticated(
  user: SessionData['user'],
): asserts user is NonNullable<SessionData['user']> {
  if (!user) {
    throw Trpc.handleStatus(401, 'user not authenticated')
  }
}
