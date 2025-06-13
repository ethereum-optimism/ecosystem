import { switchChain } from '@wagmi/core'
import type { AbiParameter, Chain, ChainContract } from 'viem'
import { concat, encodeAbiParameters, zeroAddress } from 'viem'
import {
  useConfig,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'

import { getCurrency } from '@/actions/uniswap/getCurrency'
import { getPoolId, poolKeyAbiParameters } from '@/actions/uniswap/getPoolId'
import { v4RouterAbi } from '@/constants/v4RouterAbi'
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
  const { poolKey } = getPoolId({
    currency0: getCurrency(token0, chain),
    currency1: getCurrency(token1, chain),
  })

  const config = useConfig()

  const inputAddress = token0.address ?? zeroAddress
  const zeroForOne = inputAddress === poolKey.currency0
  const isInputEth = inputAddress === zeroAddress

  const routerAddress = (chain.contracts?.uniV4Router as ChainContract).address

  const { data: hash, writeContractAsync, isPending } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

  const swap = async () => {
    const actions = concat([SWAP_EXACT_IN_SINGLE, SETTLE_ALL, TAKE_ALL])
    const swapExactInSingleData = encodeAbiParameters(
      exactInputSingleParameters,
      [
        poolKey,
        zeroForOne,
        BigInt(amount0In),
        BigInt(0), // accept any amount out
        '0x',
      ],
    )

    const settleAllData = encodeAbiParameters(settleAllParameters, [
      inputAddress === poolKey.currency0
        ? poolKey.currency0
        : poolKey.currency1,
      BigInt(amount0In),
    ])

    const takeAllData = encodeAbiParameters(takeAllParameters, [
      inputAddress === poolKey.currency0
        ? poolKey.currency1
        : poolKey.currency0,
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
        value: BigInt(isInputEth ? amount0In : 0),
        functionName: 'executeActions',
        args: [routerData],
      })
    } catch (error) {
      console.error(`ERROR SWAPPING: ${error}`)
    }
  }

  return { swap, isPending: isPending || isConfirming }
}
