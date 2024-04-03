import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { addressEqualityCheck, retryWithBackoff } from './helpers'

describe('helpers', () => {
  describe('retryWithBackoff', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should resolve with the result if operation succeeds', async () => {
      const operation = vi.fn().mockResolvedValue('operation result')
      const result = await retryWithBackoff(operation, 3, 100, 1000)
      expect(result).to.equal('operation result')
      expect(operation).toHaveBeenCalledOnce()
    })

    it('should retry until maxRetries is reached and then reject', async () => {
      const operation = vi.fn().mockRejectedValue(new Error('operation failed'))
      retryWithBackoff(operation, 3, 100, 1000).catch((e) => {
        expect(operation).toBeCalledTimes(4)
        expect(e.message).to.equal('operation failed')
      })
      await vi.advanceTimersByTimeAsync(100)
      expect(operation).toBeCalledTimes(2)
      await vi.advanceTimersByTimeAsync(200)
      expect(operation).toBeCalledTimes(3)
      await vi.advanceTimersByTimeAsync(400)
      expect(operation).toBeCalledTimes(4)
    })

    it('should increase backoff until max delay', async () => {
      const operation = vi.fn().mockRejectedValue(new Error('operation failed'))

      retryWithBackoff(operation, 3, 100, 200).catch(() => {})
      await vi.advanceTimersByTimeAsync(100)
      expect(operation).toBeCalledTimes(2)
      await vi.advanceTimersByTimeAsync(200)
      expect(operation).toBeCalledTimes(3)
      await vi.advanceTimersByTimeAsync(200)
      expect(operation).toBeCalledTimes(4)
    })
  })

  describe('addressEqualityCheck', async () => {
    it(
      'returns true when comparing a checksummed version of an address to a ' +
        'non-checksummed version of the same address',
      () => {
        const checkSummedAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
        const nonCheckSummedAddress =
          '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'

        expect(
          addressEqualityCheck(checkSummedAddress, nonCheckSummedAddress),
        ).toBe(true)
      },
    )
  })
})
