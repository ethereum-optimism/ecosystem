import { interopRcAlpha0, interopRcAlpha1 } from '@eth-optimism/viem/chains'
import { http } from 'viem'

import type { Endpoints } from '@/createPonderConfig.js'
import { createPonderConfig } from '@/createPonderConfig.js'

const endpoints: Endpoints = {
  interopRcAlpha0: {
    chainId: interopRcAlpha0.id,
    transport: http(interopRcAlpha0.rpcUrls.default.http[0]),
  },
  interopRcAlpha1: {
    chainId: interopRcAlpha1.id,
    transport: http(interopRcAlpha1.rpcUrls.default.http[0]),
  },
}

export default createPonderConfig(endpoints)
