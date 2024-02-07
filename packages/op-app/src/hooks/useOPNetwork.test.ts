import { describe, expect, it } from 'vitest'

import type { NetworkType } from '..'
import { networkPairsByGroup, useOPNetwork } from '..'
import { renderHook } from '../test-utils/react'

describe('useOPNetwork', () => {
  Object.keys(networkPairsByGroup).forEach((group) => {
    const networkPairs = networkPairsByGroup[group as NetworkType]

    Object.keys(networkPairs).forEach((network) => {
      it(`should return expected l1 & l2 for ${group} ${network}`, () => {
        const [expectedL1, expectedL2] = networkPairs[network]

        const { result: l1FilterResult } = renderHook(() =>
          useOPNetwork({
            type: group as NetworkType,
            chainId: expectedL1.id,
          }),
        )
        expect(l1FilterResult.current.networkPair.l1.id).toEqual(expectedL1.id)
        expect(l1FilterResult.current.networkPair.l2.id).toEqual(expectedL2.id)

        const { result: l2FilterResult } = renderHook(() =>
          useOPNetwork({
            type: group as NetworkType,
            chainId: expectedL2.id,
          }),
        )
        expect(l2FilterResult.current.networkPair.l1.id).toEqual(expectedL1.id)
        expect(l2FilterResult.current.networkPair.l2.id).toEqual(expectedL2.id)
      })
    })
  })
})
