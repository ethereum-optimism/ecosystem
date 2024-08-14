import { defineChain } from 'viem'
import { mainnet, optimism } from 'viem/chains'

export const supersimL1 = defineChain({
  ...mainnet,
  id: 900,
  name: 'Supersim L1',
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8545'],
    },
  },
  testnet: true,
})

export const supersimL2A = defineChain({
  ...optimism,
  id: 901,
  name: 'Supersim L2 A',
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:9545'],
    },
  },
  testnet: true,
  sourceId: 900,
})

export const supersimL2B = defineChain({
  ...optimism,
  id: 902,
  name: 'Supersim L2 B',
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:9546'],
    },
  },
  testnet: true,
  sourceId: 900,
})
