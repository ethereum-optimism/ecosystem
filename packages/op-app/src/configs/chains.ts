// DO NOT MODIFY THIS FILE IS AUTOGENERATED
import { defineChain } from 'viem'

export const orderlyNetwork = defineChain({
  id: 291,
  name: 'Orderly Network',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.orderly.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Orderly Network',
      url: 'https://explorer.orderly.network',
    },
  },
})

export const lyra = defineChain({
  id: 957,
  name: 'Lyra',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.lyra.finance'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Lyra',
      url: 'https://explorer.lyra.finance',
    },
  },
})

export const mode = defineChain({
  id: 34443,
  name: 'Mode',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.mode.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Mode',
      url: 'https://explorer.mode.network',
    },
  },
})
