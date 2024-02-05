import { describe, expect, it } from 'vitest'

import { l2 } from '../test-utils/chains'
import { renderHook } from '../test-utils/react'
import { useL2PublicClient } from '.'

describe('useL2PublicClient', () => {
  it('should return default l1PublicClient', () => {
    const { result } = renderHook(() => useL2PublicClient({ type: 'op' }))
    expect(result.current.l2PublicClient.chain?.id).toEqual(l2.id)
  })

  it('should return expected l1PublicClient when providing a chain id', () => {
    const { result } = renderHook(() =>
      useL2PublicClient({ type: 'op', chainId: l2.id }),
    )
    expect(result.current.l2PublicClient.chain?.id).toEqual(l2.id)
  })
})
