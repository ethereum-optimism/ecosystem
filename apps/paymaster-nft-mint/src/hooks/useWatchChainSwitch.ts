import { config } from '@/config'
import { watchChainId } from 'wagmi/actions'
import { useEffect } from 'react'

export const useWatchChainSwitch = (
  onChainSwitch: (chainId: number) => void,
) => {
  useEffect(() => {
    return watchChainId(config, {
      onChange(chainId) {
        onChainSwitch(chainId)
      },
    })
  }, [onChainSwitch])
}
