import { describe, expect, it } from 'vitest'

import { renderHook } from '../test-utils/react'
import { useOPTokens } from '.'

describe('useOPTokens', () => {
  it('should return all tokens for the chain id provided', () => {
    const chainId = 1
    const { result } = renderHook(() => useOPTokens({ chainId }))

    expect(result.current.ethToken.extensions.opTokenId.toLowerCase()).toEqual(
      'eth',
    )

    result.current.erc20Tokens.forEach((token) => {
      expect(token.chainId).toEqual(chainId)
      expect(token.extensions.opTokenId.toLowerCase() !== 'eth')
    })
  })
})
