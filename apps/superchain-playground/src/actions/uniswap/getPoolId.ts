import type { AbiParameter, Address } from 'viem'
import { encodeAbiParameters, getAddress, keccak256, zeroAddress } from 'viem'

export const poolKeyAbiParameters: AbiParameter[] = [
  { name: 'currency0', type: 'address' },
  { name: 'currency1', type: 'address' },
  { name: 'fee', type: 'uint24' },
  { name: 'tickSpacing', type: 'int24' },
  { name: 'hooks', type: 'address' },
]

export interface GetPoolIdParams {
  token0Address: Address
  token1Address: Address
  fee?: number
  tickSpacing?: number
  hooks?: Address
}

export const getPoolId = ({
  token0Address,
  token1Address,
  fee = 0,
  tickSpacing = 60,
  hooks = zeroAddress,
}: GetPoolIdParams) => {
  const [currency0, currency1] =
    token0Address.toLowerCase() < token1Address.toLowerCase()
      ? [token0Address, token1Address]
      : [token1Address, token0Address]

  const encodedPoolKey = encodeAbiParameters(poolKeyAbiParameters, [
    getAddress(currency0),
    getAddress(currency1),
    fee,
    tickSpacing,
    hooks,
  ])

  const poolId = keccak256(encodedPoolKey)
  const poolKey = { currency0, currency1, fee, tickSpacing, hooks }
  return { poolId, poolKey }
}
