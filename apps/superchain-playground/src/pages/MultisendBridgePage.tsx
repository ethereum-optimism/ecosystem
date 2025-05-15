import { networks } from '@eth-optimism/viem/chains'

import { AvailableNetworks } from '@/components/AvailableNetworks'
import { MultisendBridgeCard } from '@/components/MultisendBridgeCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useConfig } from '@/stores/useConfig'

const requiredNetworks = [
  networks['sepolia']!,
  networks['interop-alpha']!,
  networks['supersim']!,
]

export const MultisendBridgePage = () => {
  const { networkName, setNetworkName } = useConfig()

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto">
      <AvailableNetworks requiredNetworks={requiredNetworks} />
      <Tabs defaultValue={networkName} value={networkName}>
        <TabsList className="w-full flex">
          {requiredNetworks.map((network) => (
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
        {requiredNetworks.map((network) => {
          return (
            <TabsContent key={network.name} value={network.name}>
              <MultisendBridgeCard network={network} />
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
