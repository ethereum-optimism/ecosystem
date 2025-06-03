import { switchChain } from '@wagmi/core'
import { type Chain, zeroAddress } from 'viem'
import {
  useConfig,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'

import { getPoolId } from '@/actions/uniswap/getPoolId'
import { poolManagerAbi } from '@/constants/poolManagerAbi'
import { stateViewAbi } from '@/constants/stateViewAbi'
import {
  POOLMANAGER_ADDRESS,
  STATEVIEW_ADDRESS,
} from '@/hooks/uniswap/addresses'
import type { Token } from '@/types/Token'

const SQRT_PRICE_X96_1_1 = 79228162514264337593543950336n

export const usePool = ({
  tokenPair,
  chain,
}: {
  tokenPair: { token0: Token; token1: Token }
  chain: Chain
}) => {
  const { token0, token1 } = tokenPair

  const config = useConfig()
  const { poolKey, poolId } = getPoolId({
    token0Address: token0.refAddress ?? token0.address ?? zeroAddress,
    token1Address: token1.refAddress ?? token1.address ?? zeroAddress,
  })

  const {
    data: hash,
    writeContractAsync,
    isPending,
    error,
  } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

  if (error) {
    console.error(`ERROR INITIALIZING POOL: ${error}`)
  }

  const initializePool = async () => {
    const { currency0: c0, currency1: c1 } = poolKey
    console.log(`INITIALIZING POOL: (${c0},${c1})`)

    await switchChain(config, { chainId: chain.id })
    await writeContractAsync({
      address: POOLMANAGER_ADDRESS,
      abi: poolManagerAbi,
      functionName: 'initialize',
      args: [poolKey, SQRT_PRICE_X96_1_1],
    })
  }

  const { data } = useReadContract({
    address: STATEVIEW_ADDRESS,
    chainId: chain.id,
    abi: stateViewAbi,
    functionName: 'getSlot0',
    args: [poolId],
    query: { refetchInterval: 200 },
  })

  const sqrtPriceX96 = data?.[0] ?? 0n
  return {
    sqrtPriceX96,
    initialized: sqrtPriceX96 > 0n,
    initializePool,
    isPending: isPending || isConfirming,
  }
}
