import { useMemo } from 'react'
import { useAccount, useConfig } from 'wagmi'

export const useIsNetworkUnsupported = () => {
  const { chain } = useAccount()
  const config = useConfig()

  const isUnsupported = useMemo<boolean | undefined>(() => {
    return chain
      ? !config.chains.find((curChain) => curChain.id === chain?.id)
      : undefined
  }, [chain, config.chains])

  return { isUnsupported }
}
