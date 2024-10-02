import { createConfig } from '@ponder/core'
import { http } from 'viem'
import {
  supersimL2A,
  supersimL2B,
  l2ToL2CrossDomainMessengerABI,
  contracts,
} from '@eth-optimism/viem'

export default createConfig({
  networks: {
    opchainA: {
      chainId: supersimL2A.id,
      transport: http(process.env.SUPERSIM_L2A_RPC_URL),
    },
    opchainB: {
      chainId: supersimL2B.id,
      transport: http(process.env.SUPERSIM_L2B_RPC_URL),
    },
  },
  contracts: {
    L2toL2CDM: {
      network: {
        opchainA: {
          address: contracts.l2ToL2CrossDomainMessenger.address,
        },
        opchainB: {
          address: contracts.l2ToL2CrossDomainMessenger.address,
        },
      },
      abi: l2ToL2CrossDomainMessengerABI,
    },
  },
})
