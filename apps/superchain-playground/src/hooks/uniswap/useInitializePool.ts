import type { Address } from 'viem'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'

import { poolManagerAbi } from '@/constants/poolManagerAbi'
import { POOLMANAGER_ADDRESS } from '@/hooks/uniswap/addresses'
import { getPoolId } from '@/hooks/uniswap/poolKey'

const SQRT_PRICE_X96_1_1 = 79228162514264337593543950336n

export const useInitializePool = ({
  buyToken,
  sellToken,
}: {
  buyToken: Address
  sellToken: Address
}) => {
  const { poolKey } = getPoolId({ buyToken, sellToken })

  const { data: hash, writeContract, isPending, error } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })
  if (error) {
    console.error(`ERROR INITIALIZING POOL: ${error}`)
  }

  const initializePool = () => {
    const { currency0: c0, currency1: c1 } = poolKey
    console.log(`initializing pool [${c0},${c1}]`)

    writeContract({
      address: POOLMANAGER_ADDRESS,
      abi: poolManagerAbi,
      functionName: 'initialize',
      args: [poolKey, SQRT_PRICE_X96_1_1],
    })
  }

  return { initializePool, isPending: isPending || isConfirming }
}
