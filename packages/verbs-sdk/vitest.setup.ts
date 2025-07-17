import { expect } from 'vitest'

// Add custom matchers
expect.extend({
  toBeArray(received) {
    const pass = Array.isArray(received)
    if (pass) {
      return {
        message: () => `expected ${received} not to be an array`,
        pass: true,
      }
    } else {
      return {
        message: () => `expected ${received} to be an array`,
        pass: false,
      }
    }
  },
})

// Extend the global expect interface
declare global {
  namespace Vi {
    interface AsymmetricMatchersContaining {
      toBeArray(): unknown
    }
  }
}
