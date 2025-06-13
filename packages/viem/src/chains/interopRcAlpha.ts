import { defineChain } from 'viem'
import { sepolia } from 'viem/chains'
import { chainConfig } from 'viem/op-stack'

import {
  interopRcAlpha0Contracts,
  interopRcAlpha1Contracts,
} from '@/chains/interopRcAlphaContracts.js'
import type { Network } from '@/chains/types.js'

const sourceId = sepolia.id

/**
 * L2 chain A definition for interop-rc-alpha-0
 * @category interop-rc-alpha
 */
export const interopRcAlpha0 = defineChain({
  ...chainConfig,
  id: 420120003,
  name: 'Interop RC Alpha 0',
  rpcUrls: {
    default: {
      http: ['https://interop-rc-alpha-0.optimism.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Interop RC Alpha 0 Block Explorer',
      url: '',
    },
  },
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  sourceId,
  testnet: true,
  contracts: {
    ...chainConfig.contracts,
    ...interopRcAlpha0Contracts,
  },
})

/**
 * L2 chain A definition for interop-rc-alpha-1
 * @category interop-rc-alpha
 */
export const interopRcAlpha1 = defineChain({
  ...chainConfig,
  id: 420120004,
  name: 'Interop RC Alpha 1',
  rpcUrls: {
    default: {
      http: ['https://interop-rc-alpha-1.optimism.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Interop RC Alpha 0 Block Explorer',
      url: '',
    },
  },
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  sourceId,
  testnet: true,
  contracts: {
    ...chainConfig.contracts,
    ...interopRcAlpha1Contracts,
  },
})

export const interopRcAlphaChains = [interopRcAlpha0, interopRcAlpha1]

export const interopRcAlphaNetwork: Network = {
  name: 'interop-rc-alpha',
  sourceChain: sepolia,
  chains: interopRcAlphaChains,
}
