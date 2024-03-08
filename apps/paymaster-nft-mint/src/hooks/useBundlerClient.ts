import { useChainRpcConfig } from '@/hooks/useChainRpcConfig'
import { ENTRYPOINT_ADDRESS_V06, createBundlerClient } from 'permissionless'
import { useMemo } from 'react'
import { http } from 'viem'

export const useBundlerClient = () => {
  const { chain, bundlerRpcUrl } = useChainRpcConfig()
  return useMemo(() => {
    return createBundlerClient({
      entryPoint: ENTRYPOINT_ADDRESS_V06,
      chain: chain,
      transport: http(bundlerRpcUrl),
    })
  }, [chain, bundlerRpcUrl])
}
