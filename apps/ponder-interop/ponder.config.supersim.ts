import { supersimL2A, supersimL2B } from '@eth-optimism/viem/chains'
import { http } from 'viem'

import { type ChainConfigs, createPonderConfig } from '@/createPonderConfig.js'

const endpoints: ChainConfigs = {
  supersimL2A: {
    id: supersimL2A.id,
    rpc: http(supersimL2A.rpcUrls.default.http[0]),
    disableCache: true,
  },
  supersimL2B: {
    id: supersimL2B.id,
    rpc: http(supersimL2B.rpcUrls.default.http[0]),
    disableCache: true,
  },
}

export default createPonderConfig(endpoints)
