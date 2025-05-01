import {
  contracts as addrs,
  l2ToL2CrossDomainMessengerAbi,
} from '@eth-optimism/viem'
import { createConfig } from 'ponder'
import type { Transport } from 'viem'

export type Endpoint = { chainId: number; transport: Transport }

/**
 * A map of name to {@link Endpoint}
 */
export type Endpoints = Record<string, Endpoint>

/**
 * Create a Ponder config for interop
 * @param endpoints - Interoperable endpoints to index -- {@link Endpoints}
 * @returns Ponder configuration
 */
export function createPonderConfig(
  endpoints: Endpoints,
): ReturnType<typeof createConfig<Endpoints, ReturnType<typeof getContracts>>> {
  if (Object.keys(endpoints).length === 0) {
    throw new Error('no endpoints provided')
  }

  return createConfig({
    ordering: 'multichain',
    networks: endpoints,
    contracts: getContracts(endpoints),
  })
}

const getContracts = (endpoints: Endpoints) => ({
  L2ToL2CDM: {
    abi: l2ToL2CrossDomainMessengerAbi,
    startBlock: 1,
    network: Object.fromEntries(
      Object.keys(endpoints).map((key) => [
        key,
        { address: addrs.l2ToL2CrossDomainMessenger.address },
      ]),
    ),
  },
})
