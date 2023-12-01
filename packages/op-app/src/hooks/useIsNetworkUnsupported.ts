import { useOPNetworkContext } from './useOPNetworkContext'

export const useIsNetworkUnsupported = () => {
    const { isCurrentNetworkUnsupported } = useOPNetworkContext()
    return { isCurrentNetworkUnsupported }
}
