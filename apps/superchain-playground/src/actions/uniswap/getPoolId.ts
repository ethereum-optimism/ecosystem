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
  currency0: Address
  currency1: Address
  fee?: number
  tickSpacing?: number
  hooks?: Address
}

export const getPoolId = ({
  currency0,
  currency1,
  fee = 0,
  tickSpacing = 60,
  hooks = zeroAddress,
}: GetPoolIdParams) => {
  // Enforced ordering of currency0 and currency1
  ;[currency0, currency1] =
    currency0.toLowerCase() < currency1.toLowerCase()
      ? [currency0, currency1]
      : [currency1, currency0]

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
