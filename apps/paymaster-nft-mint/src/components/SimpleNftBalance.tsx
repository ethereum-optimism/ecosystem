import { useSimpleNftBalance } from '@/hooks/useSimpleNftBalance'
import { Skeleton } from '@eth-optimism/ui-components'
import { RiLoader4Line } from '@remixicon/react'
import { Address } from 'viem'

export const SimpleNftBalance = ({ address }: { address: Address }) => {
  const {
    data: nftBalance,
    isLoading: isNftBalanceLoading,
    isRefetching,
  } = useSimpleNftBalance(address)

  const isLoading = isNftBalanceLoading || nftBalance === undefined

  return (
    <div className="flex flex-col">
      <div className="font-semibold">SimpleNFT balance</div>
      {isLoading ? (
        <Skeleton className="w-full h-6" />
      ) : (
        <div className="flex items-center">
          {nftBalance.toString()}
          {isRefetching && (
            <RiLoader4Line className="ml-1 w-[1rem] h-[1rem] animate-spin" />
          )}
        </div>
      )}
    </div>
  )
}
