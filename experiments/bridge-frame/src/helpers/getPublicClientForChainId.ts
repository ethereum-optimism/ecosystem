import { createPublicClient, http } from 'viem'

import {
  getChainConfigForId,
  type SupportedChainId,
  supportedChains,
} from '@/constants/supportedChains'
import type { Env } from '@/env'

export const getPublicClientForChainId = (
  env: Env,
  chainId: SupportedChainId,
) => {
  const chain = supportedChains.find((c) => c.id === chainId)

  if (!chain) {
    throw Error(`Chain with id ${chainId} not supported`)
  }

  return createPublicClient({
    chain,
    transport: http(getChainConfigForId(env, chainId).rpcUrl),
  })
}
