import { interopAlpha0, interopAlpha1 } from '@eth-optimism/viem/chains'
import { http } from 'viem'

import { type ChainConfigs, createPonderConfig } from '@/createPonderConfig.js'

const endpoints: ChainConfigs = {
  interopAlpha0: {
    id: interopAlpha0.id,
    rpc: http(interopAlpha0.rpcUrls.default.http[0]),
  },
  interopAlpha1: {
    id: interopAlpha1.id,
    rpc: http(interopAlpha1.rpcUrls.default.http[0]),
  },
}

export default createPonderConfig(endpoints)
