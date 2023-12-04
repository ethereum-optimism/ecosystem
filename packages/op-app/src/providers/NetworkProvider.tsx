import { useMemo } from 'react'
import { useAccount, useConfig } from 'wagmi'

import { OPNetworkContext } from '../contexts/OPNetworkContext'
import type { NetworkType, OPNetworkContextValue } from '../types'
import { getNetworkPair } from '../utils/networkPairs'

export type NetworkProviderProps = {
  children: React.ReactNode
  type: NetworkType
}

export const NetworkProvider = ({ children, type }: NetworkProviderProps) => {
  const { chain } = useAccount()
  const config = useConfig()

  const value = useMemo<OPNetworkContextValue>(() => {
    return {
      currentNetwork: chain,
      currentNetworkPair: getNetworkPair(chain?.id ?? -1, type),
      isCurrentNetworkUnsupported: chain
        ? !config.chains.find((curChain) => curChain.id === chain?.id)
        : undefined,
    }
  }, [chain, type, config])

  return (
    <OPNetworkContext.Provider value={value}>
      {children}
    </OPNetworkContext.Provider>
  )
}
