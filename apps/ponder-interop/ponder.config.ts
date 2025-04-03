import { contracts, l2ToL2CrossDomainMessengerAbi } from '@eth-optimism/viem'
import { supersimL2A, supersimL2B } from '@eth-optimism/viem/chains'
import { createConfig } from 'ponder'
import { http } from 'viem'

export default createConfig({
  ordering: 'multichain',
  networks: {
    supersimL2A: {
      chainId: supersimL2A.id,
      transport: http(supersimL2A.rpcUrls.default.http[0]),
    },
    supersimL2B: {
      chainId: supersimL2B.id,
      transport: http(supersimL2B.rpcUrls.default.http[0]),
    },
  },
  contracts: {
    L2ToL2CDM: {
      abi: l2ToL2CrossDomainMessengerAbi,
      startBlock: 1,
      network: {
        supersimL2A: {
          address: contracts.l2ToL2CrossDomainMessenger.address,
        },
        supersimL2B: {
          address: contracts.l2ToL2CrossDomainMessenger.address,
        },
      },
    },
  },
})
