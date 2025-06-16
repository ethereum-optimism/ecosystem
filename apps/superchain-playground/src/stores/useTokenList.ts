import { contracts } from '@eth-optimism/viem'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { Token } from '@/types/Token'

export const DEFAULT_TOKENS: Token[] = [
  { symbol: 'ETH', name: 'Ethereum', decimals: 18 },
  {
    symbol: 'WETH',
    name: 'Wrapped Ether',
    address: contracts.weth.address,
    decimals: 18,
  },
]

export type TokenList = {
  tokens: Token[]
  addToken: (token: Token) => void
  removeToken: (token: Token) => void
  clearTokens: () => void
}

export const useTokenList = create<TokenList>()(
  persist(
    (set, get) => ({
      tokens: DEFAULT_TOKENS,
      addToken: (token: Token) => {
        const tokens = get().tokens
        const existing = tokens.find((t) => t.address === token.address)
        if (!existing) set({ tokens: [...tokens, token] })
        else {
          set({
            tokens: tokens.map((t) =>
              t.address === token.address ? token : t,
            ),
          })
        }
      },
      removeToken: (token: Token) => {
        set({ tokens: get().tokens.filter((t) => t.symbol !== token.symbol) })
      },
      clearTokens: () => {
        set({ tokens: DEFAULT_TOKENS })
      },
    }),
    { name: 'token-list' },
  ),
)
