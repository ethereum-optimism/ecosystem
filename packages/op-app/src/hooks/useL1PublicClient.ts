import { usePublicClient } from 'wagmi'

import type { NetworkType } from '../types'
import { useOPNetwork } from './useOPNetwork'

export type UseL1PublicClientArgs = {
  chainId?: number
  type: NetworkType
}

export const useL1PublicClient = ({ type, chainId }: UseL1PublicClientArgs) => {
  const { networkPair } = useOPNetwork({ type, chainId })
  const l1PublicClient = usePublicClient({ chainId: networkPair?.l1.id })
  return { l1PublicClient }
}
