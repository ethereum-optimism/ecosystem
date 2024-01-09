import { describe, expect, it } from 'vitest'

import { l2 } from '../test-utils/chains'
import { renderConnectedHook } from '../test-utils/react'
import { useL2PublicClient } from '.'

describe('useL2PublicClient', () => {
  it('should return default l1PublicClient', () => {
    const { result } = renderConnectedHook(
      () => useL2PublicClient({ type: 'op' }),
      {
        network: 'l2',
      },
    )
    expect(result.current.l2PublicClient.chain?.id).toEqual(l2.id)
  })

  it('should return expected l1PublicClient when providing a chain id', () => {
    const { result } = renderConnectedHook(
      () => useL2PublicClient({ type: 'op', chainId: l2.id }),
      {
        network: 'l2',
      },
    )
    expect(result.current.l2PublicClient.chain?.id).toEqual(l2.id)
  })
})