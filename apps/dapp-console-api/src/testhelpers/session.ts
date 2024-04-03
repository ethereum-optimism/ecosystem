// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Mock } from 'vitest'
import { vi } from 'vitest'

import type { SessionData } from '@/constants'

export const mockUserSession = (user?: SessionData['user']) => ({
  ...(user && {
    user: {
      ...user,
    },
  }),
  save: vi.fn(),
  destroy: vi.fn(),
  updateConfig: vi.fn(),
})
