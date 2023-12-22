import { Chain, formatUnits } from 'viem'
import { Label } from '@/components/ui/label'

import type { Token } from '@eth-optimism/op-app'
import { useAccount, useBalance } from 'wagmi'
import { useMemo } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export type FromProps = {
  chain: Chain
  amount?: string
  selectedToken: Token
}

export const To = ({ chain, amount, selectedToken }: FromProps) => {
  const { address } = useAccount()

  const balance = useBalance({
    chainId: chain.id,
    address:
      selectedToken.extensions.opTokenId.toLowerCase() === 'eth'
        ? address
        : selectedToken.address,
  })

  const formattedBalance = useMemo<string>(() => {
    if (!balance.data) {
      return '0.0'
    }
    return formatUnits(balance.data.value, balance.data.decimals).toString()
  }, [balance])

  return (
    <div>
      <div className="from-label">
        <Label>To:</Label> {chain.name}
        {amount && selectedToken && (
          <div className="text-sm">
            You will receive: {amount} {selectedToken.symbol.toUpperCase()}
          </div>
        )}
        <div className="flex flex-row items-center py-3">
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
