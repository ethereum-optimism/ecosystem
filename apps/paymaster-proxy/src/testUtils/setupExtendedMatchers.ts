import { isHex } from 'viem'
import { expect } from 'vitest'

expect.extend({
  toBeNonNullHex: (received, expected) => {
    if (isHex(received) === false || received === '0x') {
      return {
        message: () => `expected ${received} to be a non-null hex string`,
        pass: false,
      }
    }
    return {
      pass: true,
      message: () => 'passed',
    }
  },
})
