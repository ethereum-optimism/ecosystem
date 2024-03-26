import type { Mock } from 'vitest'
import { vi } from 'vitest'

import type { SessionData } from '@/constants'

export const mockUserSession = (user?: SessionData['user']) => ({
  ...(user && {
    user: {
      ...user,
    },
  }),
  save: vi.fn() as Mock,
  destroy: vi.fn() as Mock,
  updateConfig: vi.fn() as Mock,
})
