import { interopRcAlpha0, interopRcAlpha1 } from '@eth-optimism/viem/chains'
import { http } from 'viem'

import type { ChainConfigs } from '@/createPonderConfig.js'
import { createPonderConfig } from '@/createPonderConfig.js'

const endpoints: ChainConfigs = {
  interopRcAlpha0: {
    id: interopRcAlpha0.id,
    rpc: http(interopRcAlpha0.rpcUrls.default.http[0]),
  },
  interopRcAlpha1: {
    id: interopRcAlpha1.id,
    rpc: http(interopRcAlpha1.rpcUrls.default.http[0]),
  },
}

export default createPonderConfig(endpoints)
