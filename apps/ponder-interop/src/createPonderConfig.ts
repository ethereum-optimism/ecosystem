import { contracts as addrs } from '@eth-optimism/viem'
import { l2ToL2CrossDomainMessengerAbi } from '@eth-optimism/viem/abis'
import { gasTankAbi } from '@eth-optimism/viem/abis/experimental'
import { createConfig, mergeAbis } from 'ponder'
import type { Transport } from 'viem'

import { l2ToL2CrossDomainMessengerAbi as l2ToL2CrossDomainMessengerDevnetAbi } from '@/abis/devnetAbis'
import { envVars } from '@/constants/envVars.js'

export type Endpoint = {
  chainId: number
  transport: Transport
  disableCache?: boolean
}

/**
 * A map of name to {@link Endpoint}
 */
export type Endpoints = Record<string, Endpoint>

/**
 * Create a Ponder config for interop
 * @param endpoints - Interoperable endpoints to index -- {@link Endpoints}
 * @returns Ponder configuration
 */
export function createPonderConfig(endpoints: Endpoints) {
  if (Object.keys(endpoints).length === 0) {
    throw new Error('no endpoints provided')
  }

  // relevant interop contracts
  const contracts = {
    L2ToL2CDM: {
      abi: mergeAbis([
        l2ToL2CrossDomainMessengerAbi,
        l2ToL2CrossDomainMessengerDevnetAbi,
      ]),
      startBlock: 1,
      network: Object.fromEntries(
        Object.keys(endpoints).map((key) => [
          key,
          { address: addrs.l2ToL2CrossDomainMessenger.address },
        ]),
      ),
    },
    GasTank: {
      abi: gasTankAbi,
      startBlock: 1,
      network: Object.fromEntries(
        Object.keys(endpoints).map((key) => [
          key,
          { address: envVars.GAS_TANK_CONTRACT_ADDRESS },
        ]),
      ),
    },
  }

  return createConfig({
    ordering: 'multichain',
    networks: endpoints,
    contracts,
  })
}
