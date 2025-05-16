import {
  contracts as addrs,
  l2ToL2CrossDomainMessengerAbi,
} from '@eth-optimism/viem'
import type { ChainConfig } from 'ponder'
import { createConfig } from 'ponder'

/**
 * A map of name to {@link Endpoint}
 */
export type ChainConfigs = Record<string, ChainConfig>

/**
 * Create a Ponder config for interop
 * @param endpoints - Interoperable endpoints to index -- {@link Endpoints}
 * @returns Ponder configuration
 */
export function createPonderConfig(chainConfigs: ChainConfigs) {
  if (Object.keys(chainConfigs).length === 0) {
    throw new Error('no chain configs provided')
  }

  // relevant interop contracts
  const contracts = {
    L2ToL2CDM: {
      abi: l2ToL2CrossDomainMessengerAbi,
      startBlock: 1,
      chain: Object.fromEntries(
        Object.keys(chainConfigs).map((key) => [
          key,
          { address: addrs.l2ToL2CrossDomainMessenger.address },
        ]),
      ),
    },
  }

  return createConfig({
    ordering: 'multichain',
    chains: chainConfigs,
    contracts,
  })
}
