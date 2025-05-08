import { supersimL2A, supersimL2B } from '@eth-optimism/viem/chains'
import { http } from 'viem'

import type { Endpoints } from '@/createPonderConfig.js'
import { createPonderConfig } from '@/createPonderConfig.js'

const endpoints: Endpoints = {
  supersimL2A: {
    chainId: supersimL2A.id,
    transport: http(supersimL2A.rpcUrls.default.http[0]),
    disableCache: true,
  },
  supersimL2B: {
    chainId: supersimL2B.id,
    transport: http(supersimL2B.rpcUrls.default.http[0]),
    disableCache: true,
  },
}

export default createPonderConfig(endpoints)
