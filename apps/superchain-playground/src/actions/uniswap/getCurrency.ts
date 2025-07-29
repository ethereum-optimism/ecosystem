import type { Chain } from 'viem'
import { zeroAddress } from 'viem'

import { getERC20ReferenceAddress } from '@/actions/uniswap/getERC20ReferenceAddress'
import type { Token } from '@/types/Token'

export const getCurrency = (token: Token, chain: Chain) => {
  if (!token.address) return zeroAddress
  if (!token.nativeChainId) return token.address
  if (token.nativeChainId === chain.id) return token.address

  // Use reference address via Permit2.
  return getERC20ReferenceAddress(token, chain.id)
}
