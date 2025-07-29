import { networks } from '@eth-optimism/viem/chains'

import { AddTokenModal } from '@/components/AddTokenModal'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useConfig } from '@/stores/useConfig'
import type { Token } from '@/types/Token'

interface TokenPickerProps {
  tokens: Token[]
  selectedToken: Token
  setSelectedToken: (token: Token) => void
}

export const TokenPicker = ({
  tokens,
  selectedToken,
  setSelectedToken,
}: TokenPickerProps) => {
  const { networkName } = useConfig()

  return (
    <div className="flex gap-2">
      <Select
        value={selectedToken.symbol}
        onValueChange={(val) => {
          const token = tokens.find((t) => t.symbol === val)
          if (token) setSelectedToken(token)
        }}
      >
        <SelectTrigger className="w-32">
          <SelectValue>
            <div className="flex items-center gap-2">
              {selectedToken.symbol}
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {tokens.map((token) => (
            <SelectItem
              key={token.symbol}
              value={token.symbol}
              className="w-full text-sm flex items-center justify-between"
            >
              <div className="flex items-center gap-2">{token.symbol}</div>
            </SelectItem>
          ))}
          <AddTokenModal network={networks[networkName]} />
        </SelectContent>
      </Select>
    </div>
  )
}
