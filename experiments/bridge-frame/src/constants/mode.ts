import { defineChain } from 'viem'
import { optimism } from 'viem/chains'

const sourceId = 1 // mainnet

export const mode = /*#__PURE__*/ defineChain({
  ...optimism.formatters,
  ...optimism.serializers,
  id: 34443,
  name: 'Mode',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://mainnet.mode.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Mode Explorer',
      url: 'https://explorer.mode.network',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 2465882,
    },
    l1StandardBridge: {
      [sourceId]: {
        address: '0x735aDBbE72226BD52e818E7181953f42E3b0FF21',
      },
    },
  },
  sourceId,
})
