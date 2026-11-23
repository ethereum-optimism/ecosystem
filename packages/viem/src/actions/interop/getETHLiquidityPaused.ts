import type { Account, Chain, Client, Transport } from 'viem'
import { readContract } from 'viem/actions'

import { ethLiquidityAbi } from '@/abis/index.js'
import { interopContracts } from '@/contracts.js'

/**
 * @category Types
 */
export type GetETHLiquidityPausedReturnType = boolean

/**
 * Returns whether the `ETHLiquidity` predeploy is paused on the chain the
 * client is connected to.
 *
 * From OP Stack Upgrade 22 (Lagoon), the L1 pause applies to `ETHLiquidity`.
 * Anyone can copy the L1 pause state to L2 with
 * `L1CrossDomainMessenger.syncETHLiquidityPause()`. While `ETHLiquidity` is
 * paused, it blocks `burn` and `mint`, so {@link sendETH}, relaying an ETH
 * message, and {@link refundETH} revert with `ETHLiquidity_Paused`.
 * @category Actions
 * @param client - L2 Client
 * @returns `true` when paused - {@link GetETHLiquidityPausedReturnType}
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { op } from '@eth-optimism/viem/chains'
 * import { getETHLiquidityPaused } from '@eth-optimism/viem/actions/interop'
 *
 * const publicClientOp = createPublicClient({ chain: op, transport: http() })
 * const paused = await getETHLiquidityPaused(publicClientOp)
 */
export async function getETHLiquidityPaused<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
>(
  client: Client<Transport, TChain, TAccount>,
): Promise<GetETHLiquidityPausedReturnType> {
  return readContract(client, {
    address: interopContracts.ethLiquidity.address,
    abi: ethLiquidityAbi,
    functionName: 'paused',
  })
}
