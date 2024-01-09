import { waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { renderConnectedHook } from '../test-utils/react'
import { useIsNetworkUnsupported } from '.'

describe('useIsNetowrkUnsupported', () => {
  it('should return supported', () => {
    const { result } = renderConnectedHook(() => useIsNetworkUnsupported(), {
      network: 'l2',
    })

    waitFor(() => {
      expect(result.current.isUnsupported).toBeTruthy()
    })
  })

  it('should return unsupported', () => {
    const { result } = renderConnectedHook(() => useIsNetworkUnsupported(), {
      network: 'unsupported',
    })

    waitFor(() => {
      expect(result.current.isUnsupported).toBeFalsy()
    })
  })
})
