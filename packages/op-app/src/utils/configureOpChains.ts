import type { Chain } from 'viem'

import { networkPairsByGroup } from '../configs/networkPairs'
import type { NetworkType } from '../types'

export type ConfigureOPChainArgs = {
  defaultL2ChainId?: number
  type: NetworkType
}

export function configureOpChains({
  defaultL2ChainId,
  type,
}: ConfigureOPChainArgs): [Chain, ...Chain[]] {
  if (!networkPairsByGroup[type]) {
    throw new Error(`Invalid Network Type ${type}`)
  }

  const networkGroup = networkPairsByGroup[type]
  const pairs = Object.values(networkGroup)

  const l1s = pairs.map(([l1, _]) => l1)
  const l2s = pairs.map(([_, l2]) => l2)

  let defaultChain = networkGroup.mainnet[1]
  if (defaultL2ChainId) {
    for (const network of Object.keys(networkGroup)) {
      const [l1, l2] = networkGroup[network]
      if (l2.id === defaultL2ChainId) {
        defaultChain = l1
      }
    }
  }

  const allOtherChains = [...l1s, ...l2s].filter(
    (chain) => chain.id !== defaultChain.id,
  )
  return [defaultChain, ...allOtherChains]
}
