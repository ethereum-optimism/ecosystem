import { waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
  connectToNetwork,
  disconnectFromNetwork,
  renderHook,
} from '../test-utils/react'
import { useIsNetworkUnsupported } from '.'

describe('useIsNetworkUnsupported', () => {
  it('should return supported', async () => {
    await connectToNetwork()

    const { result } = renderHook(() => useIsNetworkUnsupported())

    waitFor(
      () => {
        expect(result.current.isUnsupported).toBeFalsy()
      },
      { timeout: 10_000 },
    )

    await disconnectFromNetwork()
  })
})
