import type { Chain } from 'viem/chains'

import {
  mainnet,
  sepolia,
  optimism,
  optimismSepolia,
  base,
  baseSepolia,
  fraxtal,
  fraxtalTestnet,
  mode,
  modeTestnet,
  zora,
  zoraSepolia,
  liskSepolia,
} from 'viem/chains'

export type SuperchainNetwork = {
  name: string
  type: NetworkType
  logo: string
  mainnet: Chain | null | undefined
  testnets: Chain[]
  docsUrl?: string
}

export type SuperchainBrand =
  | 'ethereum'
  | 'base'
  | 'fraxtal'
  | 'lisk'
  | 'mode'
  | 'op'
  | 'zora'
export type NetworkType = 'l1' | 'l2'

export const superchain: Record<SuperchainBrand, SuperchainNetwork> = {
  // L1
  ethereum: {
    name: 'Ethereum',
    type: 'l1',
    logo: '/logos/eth-logo.png',
    mainnet: mainnet,
    testnets: [sepolia],
    docsUrl: 'https://ethereum.org/developers/docs',
  },

  // L2s
  base: {
    name: 'Base',
    type: 'l2',
    logo: '/logos/base-logo.png',
    mainnet: base,
    testnets: [baseSepolia],
    docsUrl: 'https://docs.base.org/',
  },
  fraxtal: {
    name: 'Fraxtal',
    type: 'l2',
    logo: '/logos/frax-logo.png',
    mainnet: fraxtal,
    testnets: [fraxtalTestnet],
    docsUrl: 'https://docs.frax.com/fraxtal',
  },
  lisk: {
    name: 'Lisk',
    type: 'l2',
    logo: '/logos/lisk-logo.png',
    mainnet: null,
    testnets: [liskSepolia],
    docsUrl: 'https://documentation.lisk.com/',
  },
  mode: {
    name: 'Mode',
    type: 'l2',
    logo: '/logos/mode-logo.png',
    mainnet: mode,
    testnets: [modeTestnet],
    docsUrl: 'https://docs.mode.network/introduction/introducing-mode',
  },
  op: {
    name: 'OP Mainnet',
    type: 'l2',
    logo: '/logos/opmainnet-logo.png',
    mainnet: optimism,
    testnets: [optimismSepolia],
    docsUrl: 'https://docs.optimism.io/',
  },
  zora: {
    name: 'Zora',
    type: 'l2',
    logo: '/logos/zora-logo.png',
    mainnet: zora,
    testnets: [zoraSepolia],
    docsUrl: 'https://docs.zora.co/',
  },
}

export const superchainIdMap = Object.entries(superchain).reduce(
  (acc, [_, config]) => {
    if (config.mainnet) {
      acc[config.mainnet.id] = config
    }

    if (config.testnets) {
      for (const testnet of config.testnets) {
        acc[testnet.id] = config
      }
    }

    return acc
  },
  {} as Record<number, SuperchainNetwork>,
)
