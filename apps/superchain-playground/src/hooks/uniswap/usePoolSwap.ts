import { switchChain } from '@wagmi/core'
import {
  type AbiParameter,
  type Address,
  concat,
  encodeAbiParameters,
  zeroAddress,
} from 'viem'
import {
  useConfig,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'

import { getPoolId, poolKeyAbiParameters } from '@/actions/uniswap/getPoolId'
import { v4RouterAbi } from '@/constants/v4RouterAbi'
import { V4_ROUTER_ADDRESS } from '@/hooks/uniswap/addresses'

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

interface Token {
  symbol: string
  name: string
  decimals: number
  address?: Address

  nativeChainId?: number
  refAddress?: Address
}

export const usePoolSwap = ({
  token0,
  token1,
  amount0In,
}: {
  token0: Token
  token1: Token
  amount0In: number
}) => {
  const config = useConfig()

  const { poolKey } = getPoolId({
    token0Address: token0.refAddress ?? token0.address ?? zeroAddress,
    token1Address: token1.refAddress ?? token1.address ?? zeroAddress,
  })

  const inputAddress = token0.address ?? zeroAddress
  const zeroForOne = inputAddress === poolKey.currency0
  const isInputEth = inputAddress === zeroAddress

  const {
    data: hash,
    writeContractAsync,
    isPending,
    error,
  } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

  if (error) {
    console.error(`ERROR SWAPPING: ${error}`)
  }

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

    await switchChain(config, { chainId: 901 })
    await writeContractAsync({
      address: V4_ROUTER_ADDRESS,
      abi: v4RouterAbi,
      value: BigInt(isInputEth ? amount0In : 0),
      functionName: 'executeActions',
      args: [routerData],
    })
  }

  return { swap, isPending: isPending || isConfirming }
}
