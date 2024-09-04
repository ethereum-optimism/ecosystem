import type { MockedFunction } from 'vitest'
import { vi } from 'vitest'

import type { GrowthbookStore } from '../growthbook'

export const mockGrowthbookStore = {
  get: vi.fn() as MockedFunction<GrowthbookStore['get']>,
}
