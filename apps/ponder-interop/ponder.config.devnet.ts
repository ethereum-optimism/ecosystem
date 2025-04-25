import { interopAlpha0, interopAlpha1 } from '@eth-optimism/viem/chains'
import { http } from 'viem'

import type { Endpoints } from '@/createPonderConfig.js'
import { createPonderConfig } from '@/createPonderConfig.js'

const endpoints: Endpoints = {
  interopAlpha0: {
    chainId: interopAlpha0.id,
    transport: http(interopAlpha0.rpcUrls.default.http[0]),
  },
  interopAlpha1: {
    chainId: interopAlpha1.id,
    transport: http(interopAlpha1.rpcUrls.default.http[0]),
  },
}

export default createPonderConfig(endpoints)
