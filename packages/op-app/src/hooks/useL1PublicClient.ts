import type { PublicClient } from 'viem'
import { usePublicClient } from 'wagmi'

import type { NetworkType } from '../types'
import { useOPNetwork } from './useOPNetwork'

export type UseL1PublicClientArgs = {
  chainId?: number
  type: NetworkType
}

export type UseL1PublicClientReturnType = (args: UseL1PublicClientArgs) => {
  l1PublicClient: PublicClient
}

export const useL1PublicClient: UseL1PublicClientReturnType = ({
  type,
  chainId,
}: UseL1PublicClientArgs) => {
  const { networkPair } = useOPNetwork({ type, chainId })
  const l1PublicClient = usePublicClient({ chainId: networkPair?.l1.id })
  return { l1PublicClient }
}
