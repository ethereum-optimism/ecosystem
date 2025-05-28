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

import { posmAbi } from '@/constants/posmAbi'
import { POSM_ADDRESS } from '@/hooks/uniswap/addresses'
import { getPoolId, poolKeyAbiParameters } from '@/hooks/uniswap/poolKey'
import {
  MAX_USABLE_TICK,
  MIN_USABLE_TICK,
} from '@/hooks/uniswap/useLiquidityAmounts'

const MINT_LIQUIDITY_ACTION = '0x02'
const SETTLE_PAIR_ACTION = '0x0d'

const mintLiquidityParameters: AbiParameter[] = [
  { name: 'poolKey', type: 'tuple', components: poolKeyAbiParameters },
  { name: 'tickLower', type: 'int24' },
  { name: 'tickUpper', type: 'int24' },
  { name: 'liquidity', type: 'uint256' },
  { name: 'amount0Max', type: 'uint128' },
  { name: 'amount1Max', type: 'uint128' },
  { name: 'owner', type: 'address' },
  { name: 'hookData', type: 'bytes' },
]

const settlePairParameters: AbiParameter[] = [
  { name: 'currency0', type: 'address' },
  { name: 'currency1', type: 'address' },
]

const routerAbiParameters: AbiParameter[] = [
  { name: 'actions', type: 'bytes' },
  { name: 'params', type: 'bytes[]' },
]

interface Token {
  symbol: string
  name: string
  decimals: number
  address?: Address

  nativeChainId?: number
  refAddress?: Address
}

export const useAddLiquidity = ({
  token0,
  token1,
  amount0Max,
  amount1Max,
  owner,
  liquidityAmount,
}: {
  token0: Token
  token1: Token
  amount0Max: number
  amount1Max: number
  owner: Address
  liquidityAmount: number
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
    console.error(`ERROR ADDING LIQUIDITY: ${error}`)
  }

  const addLiquidity = async () => {
    const actions = concat([MINT_LIQUIDITY_ACTION, SETTLE_PAIR_ACTION])
    const mintPositionData = encodeAbiParameters(mintLiquidityParameters, [
      poolKey,
      MIN_USABLE_TICK,
      MAX_USABLE_TICK,
      BigInt(liquidityAmount),
      BigInt(amount0Max),
      BigInt(amount1Max),
      owner,
      '0x',
    ])

    const settlePairData = encodeAbiParameters(settlePairParameters, [
      poolKey.currency0,
      poolKey.currency1,
    ])

    const routerData = encodeAbiParameters(routerAbiParameters, [
      actions,
      [mintPositionData, settlePairData],
    ])

    // todo: fix this (can be token 1)
    const value = !token0.address ? amount0Max : 0
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365)

    await switchChain(config, { chainId: 901 })
    await writeContractAsync({
      address: POSM_ADDRESS,
      abi: posmAbi,
      functionName: 'modifyLiquidities',
      value: BigInt(value),
      args: [routerData, deadline],
    })
  }

  return { addLiquidity, isPending: isPending || isConfirming }
}
