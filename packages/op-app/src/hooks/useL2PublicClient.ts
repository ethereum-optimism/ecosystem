import { usePublicClient } from 'wagmi'

import { useNetworkPair } from '.'

export const useL2PublicClient = () => {
    const { currentNetworkPair } = useNetworkPair()
    const l2PublicClient = usePublicClient({ chainId: currentNetworkPair?.l2.id })
    return { l2PublicClient }
}
