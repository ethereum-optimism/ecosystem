import type { SupportedL2Chains } from '@/constants/supportedChains'
import { supportedL1Chains } from '@/constants/supportedChains'

export const getSourceChain = (chain: SupportedL2Chains[number]) => {
  const sourceChain = supportedL1Chains.find(({ id }) => id === chain.sourceId)

  if (!sourceChain) {
    throw Error('Unsupported chain')
  }

  return sourceChain
}
