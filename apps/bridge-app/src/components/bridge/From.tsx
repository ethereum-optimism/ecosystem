import { Chain, formatUnits, parseEther } from 'viem'

import type { Token } from '@eth-optimism/op-app'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useBalance, useAccount } from 'wagmi'
import { useEffect, useMemo } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/utils'
import { TokenListDialog } from '@/components/bridge/TokenListDialog'

export type FromProps = {
  l1: Chain
  l2: Chain
  action: 'deposit' | 'withdrawal'
  amount?: string
  selectedToken: Token
  onTokenChange: (l1Token: Token, l2Token: Token) => void
  onAmountChange: (amount: string) => void
  onValidationError: (validationError: string) => void
}

export const From = ({
  l1,
  l2,
  action,
  amount,
  selectedToken,
  onTokenChange,
  onAmountChange,
  onValidationError,
}: FromProps) => {
  const { address } = useAccount()

  const balance = useBalance({
    chainId: action === 'deposit' ? l1.id : l2.id,
    address:
      selectedToken.extensions.opTokenId.toLowerCase() === 'eth'
        ? address
        : selectedToken.address,
  })

  const formattedBalance = useMemo<string>(() => {
    if (!balance.data) {
      return '0.0'
    }
    return formatUnits(balance.data.value, balance.data.decimals)
  }, [balance])

  const validationError = useMemo<string>(() => {
    if (typeof amount === 'undefined') {
      return ''
    }

    const bigAmount = parseEther(amount)
    if (balance.data && bigAmount > balance.data.value) {
      return 'Insufficent Balance'
    }

    return ''
  }, [balance, amount])

  useEffect(() => {
    onValidationError(validationError)
  }, [validationError, onValidationError])

  return (
    <div>
      <div className="from-label">
        <Label>From:</Label> {action === 'deposit' ? l1.name : l2.name}
        <div className="flex flex-row w-full justify-between">
          <Input
            className={cn([
              'mt-2',
              'w-9/12',
              validationError ? 'outline-red-50 outline-solid' : '',
            ])}
            placeholder="0.0"
            type="number"
            autoFocus={true}
            maxLength={80}
            onChange={(e) => onAmountChange(e.target.value)}
          />
          <TokenListDialog
            l1={l1}
            l2={l2}
            selectedToken={selectedToken}
            onTokenChange={onTokenChange}
          />
        </div>
        {validationError && (
          <span className="inline-block text-sm text-rose-800 mt-1">
            {validationError}
          </span>
        )}
        <div className="flex flex-row items-center py-2">
          Balance:{' '}
          {!address || balance.isLoading ? (
            <Skeleton className="h-4 w-[200px] mt-1 ml-1" />
          ) : (
            formattedBalance
          )}
        </div>
      </div>
    </div>
  )
}
