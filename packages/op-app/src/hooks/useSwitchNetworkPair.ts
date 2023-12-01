import { useCallback } from 'react'
import { useSwitchChain } from 'wagmi'

import type { NetworkDirection, NetworkPair } from '../types'

export type SwitchNetworkPairArgs = {
    networkPair: NetworkPair
    direction: NetworkDirection
}

export const useSwitchNetworkDirection = ({
    networkPair,
    direction,
}: SwitchNetworkPairArgs) => {
    const { error, status, switchChain } = useSwitchChain()

    const switchNetworkPair = useCallback(() => {
        const { l1, l2 } = networkPair
        switchChain?.({ chainId: direction === 'l1' ? l1.id : l2.id })
    }, [direction, networkPair, switchChain])

    return {
        error,
        isLoading: status === 'pending',
        switchNetworkPair,
    }
}
