import type { Address } from 'viem'

export type Token = {
  symbol: string
  name: string
  decimals: number

  address?: Address
  refAddress?: Address // TODO: Remove this
  nativeChainId?: number
}
