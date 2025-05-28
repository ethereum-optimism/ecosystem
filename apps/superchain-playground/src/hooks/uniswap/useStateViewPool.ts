import { type Address, zeroAddress } from 'viem'
import { useReadContract } from 'wagmi'

import { stateViewAbi } from '@/constants/stateViewAbi'
import { STATEVIEW_ADDRESS } from '@/hooks/uniswap/addresses'
import { getPoolId } from '@/hooks/uniswap/poolKey'

interface Token {
  symbol: string
  name: string
  decimals: number
  address?: Address

  nativeChainId?: number
  refAddress?: Address
}

export const useStateViewPool = ({
  token0,
  token1,
}: {
  token0: Token
  token1: Token
}) => {
  const { poolId } = getPoolId({
    token0Address: token0.refAddress ?? token0.address ?? zeroAddress,
    token1Address: token1.refAddress ?? token1.address ?? zeroAddress,
  })

  const { data } = useReadContract({
    address: STATEVIEW_ADDRESS,
    chainId: 901,
    abi: stateViewAbi,
    functionName: 'getSlot0',
    args: [poolId],
  })

  const sqrtPriceX96 = data?.[0] ?? 0n
  return {
    sqrtPriceX96,
    initialized: sqrtPriceX96 > 0n,
  }
}
