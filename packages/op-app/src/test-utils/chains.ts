import type { Chain } from 'viem'
import { optimism } from 'viem/chains'

import { networkPairsByGroup } from '..'
import { L1_PORT, L2_PORT } from './constants'

const [mainnet, opMainnet] = networkPairsByGroup.op.mainnet

const vitestPool = process.env.VITEST_POOL_ID ?? 1

export const l1ForkURL = mainnet.rpcUrls.default.http[0]
export const l2ForkURL = optimism.rpcUrls.default.http[0]

export const l1 = {
  ...mainnet,
  port: L1_PORT,
  rpcUrls: {
    default: {
      http: [`http://127.0.0.1:${L1_PORT}/${vitestPool}`],
      webSocket: [`ws://127.0.0.1:${L1_PORT}/${vitestPool}`],
    },
    public: {
      http: [`http://127.0.0.1:${L1_PORT}/${vitestPool}`],
      webSocket: [`ws://127.0.0.1:${L1_PORT}/${vitestPool}`],
    },
  },
} as Chain

export const l2 = {
  ...opMainnet,
  port: L2_PORT,
  rpcUrls: {
    default: {
      http: [`http://127.0.0.1:${L2_PORT}/${vitestPool}`],
      webSocket: [`ws://127.0.0.1:${L2_PORT}/${vitestPool}`],
    },
    public: {
      http: [`http://127.0.0.1:${L2_PORT}/${vitestPool}`],
      webSocket: [`ws://127.0.0.1:${L2_PORT}/${vitestPool}`],
    },
  },
} as Chain
