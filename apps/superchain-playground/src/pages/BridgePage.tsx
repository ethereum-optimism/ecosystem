import { networks } from '@eth-optimism/viem/chains'

import { AvailableNetworks } from '@/components/AvailableNetworks'
import { BridgeCard } from '@/components/BridgeCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useConfig } from '@/stores/useConfig'

const supportedNetworks = [
  networks['sepolia']!,
  networks['interop-alpha']!,
  networks['supersim']!,
]

export const BridgePage = () => {
  const { networkName, setNetworkName } = useConfig()

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto">
      <AvailableNetworks requiredNetworks={supportedNetworks} />
      <Tabs defaultValue={networkName} value={networkName}>
        <TabsList className="w-full flex">
          {supportedNetworks.map((network) => (
            <TabsTrigger
              onClick={() => setNetworkName(network.name)}
              className="flex-1 relative"
              key={network.name}
              value={network.name}
            >
              {network.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {Object.values(networks).map((network) => {
          return (
            <TabsContent key={network.name} value={network.name}>
              <BridgeCard network={network} />
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
