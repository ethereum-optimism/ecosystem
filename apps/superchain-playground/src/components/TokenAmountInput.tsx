import { useAccount, useBalance } from 'wagmi'

import { TokenPicker } from '@/components/TokenPicker'
import { Input } from '@/components/ui/input'
import type { Token } from '@/types/Token'
import { truncateDecimal } from '@/utils/truncateDecimal'

interface TokenAmountInputProps {
  chainId?: number
  tokens: Token[]
  selectedToken: Token
  onTokenChange: (token: Token) => void
  amount: number
  onAmountChange: (amount: number) => void
  readOnly?: boolean
}

export const TokenAmountInput = ({
  chainId,
  tokens,
  selectedToken,
  onTokenChange,
  amount,
  onAmountChange,
  readOnly = false,
}: TokenAmountInputProps) => {
  const { address, chain } = useAccount()

  const { data } = useBalance({
    address: address,
    token: selectedToken.address,
    chainId: chainId ?? chain?.id,
  })

  const balance = data?.value
  const formattedBalance = balance ? truncateDecimal((Number(balance) / 10 ** selectedToken.decimals).toString()) : '-'

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <TokenPicker
          tokens={tokens}
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
