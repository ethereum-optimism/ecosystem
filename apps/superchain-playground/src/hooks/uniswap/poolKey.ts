import type { AbiParameter, Address } from 'viem'
import { encodeAbiParameters, getAddress, keccak256, zeroAddress } from 'viem'

export const poolKeyAbiParameters: AbiParameter[] = [
  { name: 'currency0', type: 'address' },
  { name: 'currency1', type: 'address' },
  { name: 'fee', type: 'uint24' },
  { name: 'tickSpacing', type: 'int24' },
  { name: 'hooks', type: 'address' },
]

export const getPoolId = ({
  buyToken,
  sellToken,
}: {
  buyToken: Address
  sellToken: Address
}) => {
  const [currency0, currency1] =
    sellToken.toLowerCase() < buyToken.toLowerCase()
      ? [sellToken, buyToken]
      : [buyToken, sellToken]

  const [fee, tickSpacing, hooks] = [0, 60, zeroAddress]
  const encodedPoolKey = encodeAbiParameters(poolKeyAbiParameters, [
    getAddress(currency0),
    getAddress(currency1),
    fee,
    tickSpacing,
    hooks,
  ])

  const poolId = keccak256(encodedPoolKey)
  const poolKey = { currency0, currency1, fee, tickSpacing, hooks }
  return { poolId, poolKey, encodedPoolKey }
}
