import { describe, expect, it } from 'vitest'

import { processSingleOrMultiple } from '@/helpers/processSingleOrMultiple'

const mockFn = async (n: number) => n * 2

describe('processSingleOrMultiple', () => {
  it('handles single element input', async () => {
    const result = await processSingleOrMultiple(5, mockFn)
    expect(result).toBe(10)
  })

  it('handles array input', async () => {
    const input = [1, 2, 3]
    const expected = [2, 4, 6]
    const result = await processSingleOrMultiple(input, mockFn)
    expect(result).toEqual(expected)
  })

  it('handles errors in provided function', async () => {
    const errorFn = async (n: number) => {
      throw new Error('Test error')
    }
    await expect(processSingleOrMultiple(5, errorFn)).rejects.toThrow(
      'Test error',
    )
    await expect(processSingleOrMultiple([1, 2, 3], errorFn)).rejects.toThrow(
      'Test error',
    )
  })
})
