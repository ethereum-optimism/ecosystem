// eslint-disable-next-line @typescript-eslint/no-unused-vars
import abitype from 'abitype'
import type { PublicClient } from 'viem'
import { createPublicClient, http } from 'viem'
import type { Chain } from 'viem/chains'
import { optimism } from 'viem/chains'

export const SUPPORTED_CHAINS: Chain[] = [optimism]

export const supportedChainsPublicClientsMap = SUPPORTED_CHAINS.reduce(
  (accumulator, chain) => {
    accumulator[chain.id] = createPublicClient({
      chain,
      transport: http(),
    })
    return accumulator
  },
  {} as Record<number, PublicClient | undefined>,
)
