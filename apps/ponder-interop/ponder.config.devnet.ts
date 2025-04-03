import { contracts, l2ToL2CrossDomainMessengerAbi } from '@eth-optimism/viem'
import { interopAlpha0, interopAlpha1 } from '@eth-optimism/viem/chains'
import { createConfig } from 'ponder'
import { http } from 'viem'

export default createConfig({
  ordering: 'multichain',
  networks: {
    interopAlpha0: {
      chainId: interopAlpha0.id,
      transport: http(interopAlpha0.rpcUrls.default.http[0]),
    },
    interopAlpha1: {
      chainId: interopAlpha1.id,
      transport: http(interopAlpha1.rpcUrls.default.http[0]),
    },
  },
  contracts: {
    L2ToL2CDM: {
      abi: l2ToL2CrossDomainMessengerAbi,
      startBlock: 1,
      network: {
        interopAlpha0: {
          address: contracts.l2ToL2CrossDomainMessenger.address,
        },
        interopAlpha1: {
          address: contracts.l2ToL2CrossDomainMessenger.address,
        },
      },
    },
  },
})
