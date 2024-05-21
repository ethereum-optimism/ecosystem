import type { Chain } from 'viem'
import { optimism } from 'viem/chains'

import { L2_PORT } from './constants'

const vitestPool = process.env.VITEST_POOL_ID ?? 1

export const l2 = {
  ...optimism,
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
