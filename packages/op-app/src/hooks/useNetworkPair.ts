import { useOPNetworkContext } from './useOPNetworkContext'

export const useNetworkPair = () => {
    const { currentNetworkPair } = useOPNetworkContext()
    return { currentNetworkPair }
}
