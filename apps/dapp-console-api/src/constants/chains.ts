// eslint-disable-next-line @typescript-eslint/no-unused-vars
import abitype from 'abitype'
import type { PublicClient } from 'viem'
import { createPublicClient, http } from 'viem'
import type { Chain } from 'viem/chains'
import { optimism } from 'viem/chains'

import { envVars } from './envVars'

export const SUPPORTED_CHAINS: Chain[] = [optimism]
export const SUPPORTED_CHAINS_RPC_URL_MAP: Record<string, string | undefined> =
  {
    [optimism.id]: envVars.OP_MAINNET_JSON_RPC_URL,
  }

export const supportedChainsPublicClientsMap = SUPPORTED_CHAINS.reduce(
  (accumulator, chain) => {
    accumulator[chain.id] = createPublicClient({
      chain,
      transport: http(SUPPORTED_CHAINS_RPC_URL_MAP[chain.id]),
    })
    return accumulator
  },
  {} as Record<number, PublicClient | undefined>,
)
