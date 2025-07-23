import { zeroAddress } from 'viem'
import { useAccount, useBalance } from 'wagmi'

import {
  getERC20ReferenceAddress,
  getRequiresReference,
} from '@/actions/uniswap/getERC20ReferenceAddress'
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
  chainId: selectedChainId,
  tokens,
  selectedToken,
  onTokenChange,
  amount,
  onAmountChange,
  readOnly = false,
}: TokenAmountInputProps) => {
  const { address } = useAccount()

  // If the balance is native, show it's balance on that chain
  const { data, isLoading: isLoadingBalance } = useBalance({
    address: address,
    token: selectedToken.address,
    chainId: selectedToken.nativeChainId ?? selectedChainId,
    query: { refetchInterval: 1_000 },
  })

  // TODO: We should remove this when we chain together liquidity addition with the approval.
  // But for now render the local balance of the remote token with the PositionsManager
  const requiresReference = getRequiresReference(
    selectedToken,
    selectedChainId ?? 0,
  )
  const refAddress = requiresReference
    ? getERC20ReferenceAddress(selectedToken, selectedChainId ?? 0)
    : zeroAddress
  const { data: refData } = useBalance({
    address: address,
    token: refAddress,
    chainId: selectedChainId,
    query: { enabled: requiresReference, refetchInterval: 1_000 },
  })

  const balance = (data?.value ?? 0n) + (refData?.value ?? 0n)
  const formattedBalance = isLoadingBalance
    ? '-'
    : truncateDecimal(
        (Number(balance) / 10 ** selectedToken.decimals).toString(),
      )

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
          value={amount > 0 ? amount.toString() : ''}
          onChange={(e) => onAmountChange(Number(e.target.value))}
          placeholder="0.0"
          min="0"
          className={`flex-1 ${
            readOnly ? 'opacity-50 cursor-not-allowed' : ''
          }`}
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
