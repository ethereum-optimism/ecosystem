import type { NetworkName } from '@eth-optimism/viem/chains'
import { networks } from '@eth-optimism/viem/chains'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useConfig } from '@/stores/useConfig'

interface NetworkPickerProps {
  allowedNetworkNames?: NetworkName[]
}

export const NetworkPicker = ({ allowedNetworkNames }: NetworkPickerProps) => {
  const { networkName, setNetworkName } = useConfig()

  return (
    <div className="flex-1 space-y-2">
      <label className="text-sm font-medium">Select Network</label>
      <Select
        value={networkName}
        onValueChange={(value) => setNetworkName(value as NetworkName)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a network" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(networks)
            .filter(
              (network) =>
                !allowedNetworkNames ||
                allowedNetworkNames.includes(network.name),
            )
            .map((network) => (
              <SelectItem key={network.name} value={network.name}>
                {network.name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  )
}
