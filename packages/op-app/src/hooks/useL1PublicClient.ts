import { usePublicClient } from 'wagmi'

import { useNetworkPair } from '.'

export const useL1PublicClient = () => {
    const { currentNetworkPair } = useNetworkPair()
    const l1PublicClient = usePublicClient({ chainId: currentNetworkPair?.l1.id })
    return { l1PublicClient }
}
