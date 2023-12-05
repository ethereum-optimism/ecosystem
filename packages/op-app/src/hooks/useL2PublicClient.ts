import { usePublicClient } from 'wagmi'

import type { NetworkType } from '../types'
import { useOPNetwork } from './useOPNetwork'

export type UseL2PublicClientArgs = {
  chainId?: number
  type: NetworkType
}

export const useL2PublicClient = ({ chainId, type }: UseL2PublicClientArgs) => {
  const { networkPair } = useOPNetwork({ type, chainId })
  const l2PublicClient = usePublicClient({ chainId: networkPair?.l2.id })
  return { l2PublicClient }
}
