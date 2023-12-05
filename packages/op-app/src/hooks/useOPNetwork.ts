import { useMemo } from 'react'

import { networkPairsByGroup } from '..'
import type { NetworkPair, NetworkType } from '../types'

export type UseOPNetworkArgs = {
  chainId?: number
  type: NetworkType
}

export const useOPNetwork = ({ type, chainId }: UseOPNetworkArgs) => {
  const networkPair = useMemo<NetworkPair>(() => {
    const networks = networkPairsByGroup[type]

    if (chainId) {
      for (const [name, pair] of Object.entries(networks)) {
        if ([pair[0].id, pair[1].id].includes(chainId)) {
          const [l1, l2] = networks[name]
          return { l1, l2 }
        }
      }
    }

    return { l1: networks.mainnet[0], l2: networks.mainnet[1] }
  }, [chainId, type])

  return { networkPair }
}
