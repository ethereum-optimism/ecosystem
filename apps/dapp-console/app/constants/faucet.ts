import {
  baseSepolia,
  modeTestnet,
  optimismSepolia,
  sepolia,
  zoraSepolia,
} from 'viem/chains'

export const getFaucetNetworks = (showNewLogo: boolean) => [
  {
    label: 'Base Sepolia',
    image: '/logos/base-logo.png',
    chainID: baseSepolia.id,
  },
  {
    label: 'Ethereum Sepolia',
    image: '/logos/eth-logo.png',
    chainID: sepolia.id,
  },
  {
    label: 'Lisk Sepolia',
    image: '/logos/lisk-logo.png',
    chainID: 4202,
  },
  {
    label: 'Mode Sepolia',
    image: '/logos/mode-logo.png',
    chainID: modeTestnet.id,
  },
  {
    label: 'OP Sepolia',
    image: showNewLogo
      ? '/logos/new-op-mainnet-logo.svg'
      : '/logos/op-logo.svg',
    chainID: optimismSepolia.id,
  },
  {
    label: 'Zora Sepolia',
    image: '/logos/zora-logo.png',
    chainID: zoraSepolia.id,
  },
  {
    label: 'Cyber Sepolia',
    image: '/logos/cyber-logo.png',
    chainID: 111557560,
  },
]
