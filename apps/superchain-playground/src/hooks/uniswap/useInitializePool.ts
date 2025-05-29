import { switchChain } from '@wagmi/core'
import { type Address, zeroAddress } from 'viem'
import {
  useConfig,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'

import { poolManagerAbi } from '@/constants/poolManagerAbi'
import { POOLMANAGER_ADDRESS } from '@/hooks/uniswap/addresses'
import { getPoolId } from '@/hooks/uniswap/poolKey'

const SQRT_PRICE_X96_1_1 = 79228162514264337593543950336n

interface Token {
  symbol: string
  name: string
  decimals: number
  address?: Address

  nativeChainId?: number
  refAddress?: Address
}

export const useInitializePool = ({
  token0,
  token1,
}: {
  token0: Token
  token1: Token
}) => {
  const config = useConfig()
  const { poolKey } = getPoolId({
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
    console.log(`initializing pool [${c0},${c1}]`)

    await switchChain(config, { chainId: 901 })
    await writeContractAsync({
      address: POOLMANAGER_ADDRESS,
      chainId: 901,
      abi: poolManagerAbi,
      functionName: 'initialize',
      args: [poolKey, SQRT_PRICE_X96_1_1],
    })
  }

  return { initializePool, isPending: isPending || isConfirming }
}
