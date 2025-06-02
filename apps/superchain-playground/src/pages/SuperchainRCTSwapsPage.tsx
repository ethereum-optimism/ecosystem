import type { NetworkName } from '@eth-optimism/viem/chains'
import { networks } from '@eth-optimism/viem/chains'
import { useState } from 'react'
import type { Chain } from 'viem'

import { ChainPicker } from '@/components/ChainPicker'
import { RCTSwapsCard } from '@/components/RCTSwapsCard';
import { SupportedNetworks } from '@/components/SupportedNetworks'
import { useInteropEnabledChains } from '@/hooks/useInteropEnabledChains';
import { useConfig } from '@/stores/useConfig'

const supportedNetworkNames: NetworkName[] = ['mainnet', 'interop-alpha', 'supersim']

export const SuperchainRctSwapsPage = () => {
  const { networkName } = useConfig()
  const network = networks[networkName]

  const { enabledChains, isLoading} = useInteropEnabledChains(network)
  const [selectedChain, setSelectedChain] = useState<Chain | undefined>()

  if (isLoading) {
    return <div>Filtering for interop enabled chains...</div>
  }
  if (enabledChains.length === 0) {
    return <div>No chains with interop contracts not found. If forking with supersim, set rpc url overrides</div>
  }

  // TODO: Filter Chain picker to live networks

  const interopNetwork = { ...network, chains: enabledChains }
  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto">
      <SupportedNetworks networks={supportedNetworkNames}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <ChainPicker
              network={interopNetwork}
              selectedChain={selectedChain ?? enabledChains[0]!}
              setSelectedChain={setSelectedChain}
            />
          </div>
          <RCTSwapsCard network={interopNetwork} selectedChain={selectedChain ?? enabledChains[0]!} />
        </div>
      </SupportedNetworks>
    </div>
  )
}

