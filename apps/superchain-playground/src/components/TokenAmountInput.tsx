import type { Network } from '@eth-optimism/viem/chains'
import { useAccount } from 'wagmi'

import { TokenPicker } from '@/components/TokenPicker'
import { Input } from '@/components/ui/input'
import { useCrosschainBalance } from '@/hooks/uniswap/useCrosschainBalance'
import type { Token } from '@/types/Token'
import { truncateDecimal } from '@/utils/truncateDecimal'

interface TokenAmountInputProps {
  tokenList: Token[]
  selectedToken: Token
  onTokenChange: (token: Token) => void
  amount: number
  onAmountChange: (amount: number) => void
  network: Network
  readOnly?: boolean
}

export const TokenAmountInput = ({
  tokenList,
  selectedToken,
  onTokenChange,
  amount,
  onAmountChange,
  readOnly = false,
}: TokenAmountInputProps) => {
  const { address } = useAccount()

  // TODO: Remove cross chain balance when executor contract is used
  const { balance } = useCrosschainBalance({ owner: address, token: selectedToken })
  const formattedBalance = balance ? truncateDecimal((Number(balance) / 10 ** selectedToken.decimals).toString()) : '-'

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <TokenPicker
          tokens={tokenList}
          selectedToken={selectedToken}
          setSelectedToken={onTokenChange}
        />
        <Input
          type="number"
          value={amount > 0 ? amount.toString(): ''}
          onChange={e => onAmountChange(Number(e.target.value))}
          placeholder="0.0"
          min="0"
          className={`flex-1 ${readOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
          readOnly={readOnly}
          disabled={readOnly}
        />
      </div>
      <span className="text-xs text-muted-foreground">
        Balance: {formattedBalance} {selectedToken.symbol}
      </span>
    </div>
  )
}
