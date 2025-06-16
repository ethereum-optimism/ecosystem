import { switchChain } from '@wagmi/core'
import type { AbiParameter, Chain } from 'viem'
import { concat, encodeAbiParameters, zeroAddress } from 'viem'
import {
  useConfig,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'

import { getCurrency } from '@/actions/uniswap/getCurrency'
import { getPoolId, poolKeyAbiParameters } from '@/actions/uniswap/getPoolId'
import { v4RouterAbi } from '@/constants/v4RouterAbi'
import { V4_ROUTER_ADDRESS } from '@/hooks/uniswap/addresses'
import type { Token } from '@/types/Token'

const SWAP_EXACT_IN_SINGLE = '0x06'
const SETTLE_ALL = '0x0c'
const TAKE_ALL = '0x0f'

const exactInputSingleParameters: AbiParameter[] = [
  { name: 'poolKey', type: 'tuple', components: poolKeyAbiParameters },
  { name: 'zeroForOne', type: 'bool' },
  { name: 'amountIn', type: 'uint256' },
  { name: 'minAmountOut', type: 'uint256' },
  { name: 'hookData', type: 'bytes' },
]

const routerAbiParameters: AbiParameter[] = [
  { name: 'actions', type: 'bytes' },
  { name: 'params', type: 'bytes[]' },
]

const settleAllParameters: AbiParameter[] = [
  { name: 'currency0', type: 'address' },
  { name: 'amountIn', type: 'uint256' },
]

const takeAllParameters: AbiParameter[] = [
  { name: 'currency0', type: 'address' },
  { name: 'minAmountOut', type: 'uint256' },
]

export const usePoolSwap = ({
  tokenPair,
  amount0In,
  chain,
}: {
  tokenPair: { token0: Token; token1: Token }
  amount0In: number
  chain: Chain
}) => {
  const { token0, token1 } = tokenPair
  const config = useConfig()

  const currency0 = getCurrency(token0, chain) // input
  const currency1 = getCurrency(token1, chain) // output
  const { poolKey } = getPoolId({ currency0, currency1 })

  const zeroForOne = currency0 === poolKey.currency0 // poolKey enforces currency0 < currency1
  const isInputEth = currency0 === zeroAddress

  const routerAddress = V4_ROUTER_ADDRESS

  const { data: hash, writeContractAsync, isPending } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

  const swap = async () => {
    const actions = concat([SWAP_EXACT_IN_SINGLE, SETTLE_ALL, TAKE_ALL])

    const swapParams = [poolKey, zeroForOne, BigInt(amount0In), BigInt(0), '0x']
    const swapExactInSingleData = encodeAbiParameters(
      exactInputSingleParameters,
      swapParams,
    )

    const settleAllData = encodeAbiParameters(settleAllParameters, [
      currency0,
      BigInt(amount0In),
    ])

    const takeAllData = encodeAbiParameters(takeAllParameters, [
      currency1,
      BigInt(0),
    ])

    const routerData = encodeAbiParameters(routerAbiParameters, [
      actions,
      [swapExactInSingleData, settleAllData, takeAllData],
    ])

    try {
      await switchChain(config, { chainId: chain.id })
      await writeContractAsync({
        address: routerAddress,
        abi: v4RouterAbi,
        value: isInputEth ? BigInt(amount0In) : 0n,
        functionName: 'executeActions',
        args: [routerData],
      })
    } catch (error) {
      console.error(`ERROR SWAPPING: ${error}`)
    }
  }

  return { swap, isPending: isPending || isConfirming }
}
