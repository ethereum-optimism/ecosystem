import { switchChain } from '@wagmi/core'
import type { AbiParameter, Chain } from 'viem'
import { concat, encodeAbiParameters } from 'viem'
import {
  useAccount,
  useConfig,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'

import { getCurrency } from '@/actions/uniswap/getCurrency'
import { getPoolId, poolKeyAbiParameters } from '@/actions/uniswap/getPoolId'
import { posmAbi } from '@/constants/posmAbi'
import { POSM_ADDRESS } from '@/hooks/uniswap/addresses'
import {
  MAX_USABLE_TICK,
  MIN_USABLE_TICK,
} from '@/hooks/uniswap/useLiquidityAmounts'
import type { Token } from '@/types/Token'

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

export const usePoolLiquidity = ({
  tokenPair,
  amounts,
  chain,
}: {
  tokenPair: { token0: Token; token1: Token }
  amounts: { amount0Max: number; amount1Max: number; liquidityAmount: number }
  chain: Chain
}) => {
  const { token0, token1 } = tokenPair
  const { poolKey } = getPoolId({
    currency0: getCurrency(token0, chain),
    currency1: getCurrency(token1, chain),
  })

  const { amount0Max, amount1Max, liquidityAmount } = amounts
  const { currency0, currency1 } = poolKey

  const { address } = useAccount()
  const config = useConfig()

  const posmAddress = POSM_ADDRESS

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
    console.log(`ADDING LIQUIDITY: (${currency0},${currency1})`)

    const actions = concat([MINT_LIQUIDITY_ACTION, SETTLE_PAIR_ACTION])
    const mintPositionData = encodeAbiParameters(mintLiquidityParameters, [
      poolKey,
      MIN_USABLE_TICK,
      MAX_USABLE_TICK,
      BigInt(liquidityAmount),
      BigInt(amount0Max),
      BigInt(amount1Max),
      address,
      '0x',
    ])

    const settlePairData = encodeAbiParameters(settlePairParameters, [
      currency0,
      currency1,
    ])

    const routerData = encodeAbiParameters(routerAbiParameters, [
      actions,
      [mintPositionData, settlePairData],
    ])

    // todo: fix this (can be token 1)
    const value = !token0.address ? amount0Max : 0
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365)

    await switchChain(config, { chainId: chain.id })
    await writeContractAsync({
      address: posmAddress,
      abi: posmAbi,
      functionName: 'modifyLiquidities',
      value: BigInt(value),
      args: [routerData, deadline],
    })
  }

  return { addLiquidity, isPending: isPending || isConfirming }
}
