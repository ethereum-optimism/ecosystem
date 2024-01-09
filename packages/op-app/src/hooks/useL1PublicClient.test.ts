import { describe, expect, it } from 'vitest'

import { l1 } from '../test-utils/chains'
import { renderConnectedHook } from '../test-utils/react'
import { useL1PublicClient } from '.'

describe('useL1PublicClient', () => {
  it('should return default l1PublicClient', () => {
    const { result } = renderConnectedHook(
      () => useL1PublicClient({ type: 'op' }),
      {
        network: 'l1',
      },
    )

    expect(result.current.l1PublicClient.chain?.id).toEqual(l1.id)
  })

  it('should return expected l1PublicClient when providing a chain id', () => {
    const { result } = renderConnectedHook(
      () => useL1PublicClient({ type: 'op', chainId: l1.id }),
      {
        network: 'l1',
      },
    )
    expect(result.current.l1PublicClient.chain?.id).toEqual(l1.id)
  })
})
