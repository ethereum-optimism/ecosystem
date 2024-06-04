// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Mock } from 'vitest'
import { vi } from 'vitest'

import type { SessionData } from '@/constants'

export const mockUserSession = (
  user?: SessionData['user'],
  worldIdUser?: SessionData['worldIdUser'],
) => ({
  ...(user && {
    user: {
      ...user,
    },
  }),
  ...(worldIdUser && {
    worldIdUser: {
      ...worldIdUser,
    },
  }),
  save: vi.fn().mockImplementation(async () => undefined),
  destroy: vi.fn(),
  updateConfig: vi.fn(),
})
