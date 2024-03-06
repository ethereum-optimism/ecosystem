import { useSimpleNftBalance } from '@/hooks/useSimpleNftBalance'
import { Skeleton } from '@eth-optimism/ui-components'
import { Address } from 'viem'

export const SimpleNftBalance = ({ address }: { address: Address }) => {
  const { data: nftBalance, isLoading: isNftBalanceLoading } =
    useSimpleNftBalance(address)

  const isLoading = isNftBalanceLoading || nftBalance === undefined

  return (
    <div className="flex flex-col">
      <div className="font-semibold">SimpleNFT balance</div>
      {isLoading ? (
        <Skeleton className="w-full h-6" />
      ) : (
        <div className="">{nftBalance.toString()}</div>
      )}
    </div>
  )
}
