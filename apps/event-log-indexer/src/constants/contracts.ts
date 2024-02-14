import { optimism, optimismSepolia } from 'viem/chains'

import { optimistAbi } from '../../abis/optimist'

export const optimist = {
  abi: optimistAbi,
  network: {
    [optimism.id]: {
      address: '0x2335022c740d17c2837f9C884Bfe4fFdbf0A95D5',
      filter: { event: 'Transfer' },
      startBlock: 49670714,
    },
    [optimismSepolia.id]: {
      address: '0xF6Ec1682996633B7cde3D8e33a9FD32686E993D3',
      filter: { event: 'Transfer' },
      startBlock: 2708644,
    },
  },
} as const
