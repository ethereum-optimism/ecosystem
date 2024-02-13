import { createConfig } from '@ponder/core'
import { http } from 'viem'
import { optimism } from 'viem/chains'

import { optimistAbi } from './abis/optimist'

export default createConfig({
  networks: {
    [optimism.id]: {
      chainId: optimism.id,
      transport: http(process.env.JSON_RPC_URL_OP_MAINNET),
    },
  },
  contracts: {
    optimist: {
      abi: optimistAbi,
      network: {
        [optimism.id]: {
          address: '0x2335022c740d17c2837f9C884Bfe4fFdbf0A95D5',
          filter: { event: 'Transfer' },
          startBlock: 49670714,
        },
      },
    },
  },
})
