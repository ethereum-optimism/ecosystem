import type { Hex } from 'viem'

import type { SupportedChainId } from '@/constants/supportedChains'
import type { Env } from '@/env'
import { getPublicClientForChainId } from '@/helpers/getPublicClientForChainId'
import { getKvCachedStore } from '@/kvCache/getKvCachedStore'

const getTransactionReceiptCacheKey = (
  chainId: SupportedChainId,
  transactionHash: Hex,
) => {
  return `transactionReceipt-${chainId}-${transactionHash}`
}

export const transactionReceiptStore = getKvCachedStore({
  keyFn: ({
    chainId,
    transactionHash,
  }: {
    chainId: SupportedChainId
    transactionHash: Hex
  }) => getTransactionReceiptCacheKey(chainId, transactionHash),

  fetchFn: async (
    env: Env,
    {
      chainId,
      transactionHash,
    }: { chainId: SupportedChainId; transactionHash: Hex },
  ) => {
    const publicClient = getPublicClientForChainId(env, chainId)

    return await publicClient
      .getTransactionReceipt({
        hash: transactionHash,
      })
      .catch((e) => {
        console.error(e)
        return null
      })
  },
})
