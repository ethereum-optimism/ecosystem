import type { NetworkName } from '@eth-optimism/viem/chains'
import { networks } from '@eth-optimism/viem/chains'
import { useState } from 'react'
import type { Chain } from 'viem'

import { ChainPicker } from '@/components/ChainPicker'
import { RCTSwapsCard } from '@/components/RCTSwapsCard'
import { SupportedNetworks } from '@/components/SupportedNetworks'
import { useInteropEnabledChains } from '@/hooks/useInteropEnabledChains'
import { useConfig } from '@/stores/useConfig'

const supportedNetworkNames: NetworkName[] = ['mainnet', 'supersim']

export const SuperchainRctSwapsPage = () => {
  const { networkName } = useConfig()

  const { enabledChains, isLoading } = useInteropEnabledChains(
    networks[networkName],
  )
  const [selectedChain, setSelectedChain] = useState<Chain | undefined>()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        Filtering for interop enabled chains...
      </div>
    )
  }
  if (enabledChains.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        No chains with interop contracts not found. If forking with supersim,
        set rpc url overrides
      </div>
    )
  }

  const network = { ...networks[networkName], chains: enabledChains }
  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto">
      <SupportedNetworks networks={supportedNetworkNames}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <ChainPicker
              network={network}
              selectedChain={selectedChain ?? enabledChains[0]!}
              setSelectedChain={setSelectedChain}
            />
          </div>
          <RCTSwapsCard
            network={network}
            selectedChain={selectedChain ?? enabledChains[0]!}
          />
        </div>
      </SupportedNetworks>
    </div>
  )
}
