import { switchChain } from '@wagmi/core'
import type { Chain } from 'viem'
import {
  useConfig,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'

import { getCurrency } from '@/actions/uniswap/getCurrency'
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

  const currency0 = getCurrency(token0, chain)
  const currency1 = getCurrency(token1, chain)
  const { poolKey, poolId } = getPoolId({ currency0, currency1 })

  const config = useConfig()
  const { data: hash, writeContractAsync, isPending } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

  const poolManagerAddress = POOLMANAGER_ADDRESS
  const stateViewAddress = STATEVIEW_ADDRESS

  const { data: slot0 } = useReadContract({
    address: stateViewAddress,
    chainId: chain.id,
    abi: stateViewAbi,
    functionName: 'getSlot0',
    args: [poolId],
    query: { refetchInterval: 200 },
  })

  const initializePool = async () => {
    console.log(`INITIALIZING POOL: (${currency0},${currency1})`)

    try {
      await switchChain(config, { chainId: chain.id })
      await writeContractAsync({
        abi: poolManagerAbi,
        address: poolManagerAddress,
        functionName: 'initialize',
        args: [poolKey, SQRT_PRICE_X96_1_1],
      })
    } catch (error) {
      console.error(`ERROR INITIALIZING POOL: ${error}`)
    }
  }

  const sqrtPriceX96 = slot0?.[0] ?? 0n
  return {
    sqrtPriceX96,
    initialized: sqrtPriceX96 > 0n,
    initializePool,
    isPending: isPending || isConfirming,
  }
}
