import type { Address } from 'viem'
import { useReadContract } from 'wagmi'

import { stateViewAbi } from '@/constants/stateViewAbi'
import { STATEVIEW_ADDRESS } from '@/hooks/uniswap/addresses'
import { getPoolId } from '@/hooks/uniswap/poolKey'

export const useStateViewPool = ({
  sellToken,
  buyToken,
}: {
  sellToken: Address
  buyToken: Address
}) => {
  const { poolId } = getPoolId({ buyToken, sellToken })
  const { data } = useReadContract({
    address: STATEVIEW_ADDRESS,
    abi: stateViewAbi,
    functionName: 'getSlot0',
    args: [poolId],
  })

  const sqrtPriceX96 = data?.[0] ?? 0n
  console.log(`sqrtPriceX96: ${sqrtPriceX96}`)

  return {
    sqrtPriceX96,
    initialized: sqrtPriceX96 > 0n,
  }
}
