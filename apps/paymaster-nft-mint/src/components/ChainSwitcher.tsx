import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@eth-optimism/ui-components'
import { useChainId, useSwitchChain } from 'wagmi'

export const ChainSwitcher = () => {
  const { chains, switchChain } = useSwitchChain()
  const chainId = useChainId()

  return (
    <Select
      value={chainId.toString()}
      onValueChange={(newChainId: string) =>
        switchChain({ chainId: Number(newChainId) })
      }
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a chain" />
      </SelectTrigger>
      <SelectContent>
        {chains.map((chain) => (
          <SelectItem key={chain.id} value={chain.id.toString()}>
            {chain.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
