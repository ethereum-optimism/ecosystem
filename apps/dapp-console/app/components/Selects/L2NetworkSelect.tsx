import { SuperchainNetwork, superchain } from '@/app/constants/superchain'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from '@eth-optimism/ui-components'
import { useCallback, useMemo, useState } from 'react'
import { Chain } from 'viem'
import { optimism } from 'viem/chains'
import { Network } from '@/app/components/Network'

export type SuperchainDropdownProps = {
  includeTestnets?: boolean
  onNetworkChange?: (network: L2NetworkSelectItem) => void
}

export type L2NetworkSelectItem = {
  id: number
  chain: Chain
  config: SuperchainNetwork
}

export const L2NetworkSelect = ({
  includeTestnets,
  onNetworkChange,
}: SuperchainDropdownProps) => {
  const [selectedNetwork, setSelectedNetwork] = useState<L2NetworkSelectItem>({
    id: optimism.id,
    chain: optimism,
    config: superchain.op,
  })

  const allChains = useMemo(() => {
    return Object.values(superchain).reduce((arr, config) => {
      if (config.mainnet?.id === 1) {
        return arr
      }

      if (config.mainnet) {
        arr.push({ id: config.mainnet.id, chain: config.mainnet, config })
      }

      if (includeTestnets && config.testnets) {
        for (const testnet of config.testnets) {
          arr.push({ id: testnet.id, chain: testnet, config })
        }
      }

      return arr
    }, [] as L2NetworkSelectItem[])
  }, [includeTestnets])

  const handleNetworkChange = useCallback(
    (chainIdStr: string) => {
      const chainId = parseInt(chainIdStr)
      const item = allChains.find((chain) => chainId === chain.id)

      if (item) {
        setSelectedNetwork(item)
        onNetworkChange?.(item)
      }
    },
    [allChains, onNetworkChange, setSelectedNetwork],
  )

  return (
    <Select onValueChange={handleNetworkChange}>
      <SelectTrigger className="flex justify-start w-[250px]">
        <div className="flex flex-row gap-3 items-center w-full">
          <Network chainId={selectedNetwork.id} />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {allChains.map((item) => (
            <SelectItem key={item.id} value={`${item.id}`}>
              <Network chainId={item.id} className="gap-3" />
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
