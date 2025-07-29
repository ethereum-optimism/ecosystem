import type { Network } from '@eth-optimism/viem/chains'
import { chainById } from '@eth-optimism/viem/chains'
import type { Chain } from 'viem'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ChainPickerProps {
  network: Network
  selectedChain?: Chain
  setSelectedChain: (chain: Chain) => void
}

export const ChainPicker = ({
  network,
  selectedChain,
  setSelectedChain,
}: ChainPickerProps) => {
  // chore: should filter to just live networks
  return (
    <div className="w-full">
      <Select
        onValueChange={(v) => setSelectedChain(chainById[Number(v)]!)}
        value={selectedChain?.id.toString()}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a chain" />
        </SelectTrigger>
        <SelectContent>
          {network.chains.map((chain) => {
            return (
              <SelectItem
                key={chain.id}
                value={chain.id.toString()}
                className="w-full text-sm flex items-center justify-between"
              >
                {chain.name}
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </div>
  )
}
