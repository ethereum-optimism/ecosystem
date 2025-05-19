import type { Chain } from 'viem'

/**
 * Names of all available networks
 */
export type NetworkName =
  | 'mainnet'
  | 'sepolia'
  | 'interop-alpha'
  | 'interop-rc-alpha'
  | 'supersim'

/**
 * Configuration for a network
 */
export type Network = {
  name: NetworkName
  sourceChain: Chain
  chains: Chain[]
}
