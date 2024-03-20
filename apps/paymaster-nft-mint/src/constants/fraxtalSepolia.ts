import { defineChain } from 'viem'
import { optimism } from 'viem/chains'

// TODO: upstream into viem when fraxtal-sepolia docs are up

const sourceId = 11_155_111 // sepolia

export const fraxtalSepolia = defineChain({
  ...optimism.formatters,
  ...optimism.serializers,
  id: 2523,
  network: 'fraxtal-sepolia',
  name: 'Fraxtal Sepolia',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet-sepolia.frax.com'],
    },
    public: {
      http: ['https://rpc.testnet-sepolia.frax.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://explorer.testnet-sepolia.frax.com/',
    },
  },

  contracts: {
    ...optimism.contracts,
    l2OutputOracle: {
      [sourceId]: {
        address: '0x5385782ED9d3d4ff863D7aC4ECeB6b98A7558FBF',
      },
    },
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
    },
    portal: {
      [sourceId]: {
        address: '0xf669D7759e8CAF14bc088d9fa4F159c74F6b3f2a',
      },
    },
    l1StandardBridge: {
      [sourceId]: {
        address: '0xf351AA45DC738ef406b817c1C2fa0e60278Fde97',
      },
    },
  },
  sourceId,
  testnet: true,
})
