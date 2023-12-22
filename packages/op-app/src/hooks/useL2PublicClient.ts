import type { PublicClient } from 'viem'
import { usePublicClient } from 'wagmi'

import type { NetworkType } from '../types'
import { useOPNetwork } from './useOPNetwork'

export type UseL2PublicClientArgs = {
  chainId?: number
  type: NetworkType
}

export type UseL2PublicClientReturnType = (args: UseL2PublicClientArgs) => {
  l2PublicClient: PublicClient
}

export const useL2PublicClient: UseL2PublicClientReturnType = ({
  chainId,
  type,
}: UseL2PublicClientArgs) => {
  const { networkPair } = useOPNetwork({ type, chainId })
  const l2PublicClient = usePublicClient({ chainId: networkPair?.l2.id })
  return { l2PublicClient }
}
