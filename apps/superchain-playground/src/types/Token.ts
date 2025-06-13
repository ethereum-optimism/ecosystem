import type { Address } from 'viem'

export type Token = {
  symbol: string
  name: string
  decimals: number

  address?: Address
  nativeChainId?: number
}
