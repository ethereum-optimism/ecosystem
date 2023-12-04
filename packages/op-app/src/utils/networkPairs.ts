import { networkPairsByGroup } from '../configs/networkPairs'
import type { NetworkPair, NetworkType } from '../types'

export function getNetworkPair(
  chainId: number,
  type: NetworkType,
): NetworkPair | undefined {
  if (!networkPairsByGroup[type]) {
    return
  }

  const networks = networkPairsByGroup[type]
  let networkPair: NetworkPair | undefined = undefined

  for (const network of Object.keys(networks)) {
    const [l1, l2] = networks[network]

    if ([l1.id, l2.id].includes(chainId)) {
      networkPair = { l1, l2 }
    }
  }

  return networkPair
}
