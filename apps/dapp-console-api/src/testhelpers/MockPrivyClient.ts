import type { PrivyClient } from '@privy-io/server-auth'
import { vi } from 'vitest'

export const mockPrivyClient: () => PrivyClient = () =>
  ({
    verifyAuthToken: vi.fn().mockImplementation(async () => undefined),
  }) as any
