import type { Hex } from 'viem'

import type { SupportedChains } from '@/constants/supportedChains'

export const getChainTxLink = (chain: SupportedChains[number], txHash: Hex) => {
  return `${chain.blockExplorers!.default.url}/tx/${txHash}`
}
