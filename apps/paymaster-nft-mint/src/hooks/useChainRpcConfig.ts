import { envVars } from '@/envVars'
import { Chain, optimismSepolia, sepolia } from 'viem/chains'
import { useChainId } from 'wagmi'

const aaRpcConfigByChainId: Record<
  number,
  { chain: Chain; paymasterRpcUrl: string; bundlerRpcUrl: string }
> = {
  [sepolia.id]: {
    chain: sepolia,
    paymasterRpcUrl: envVars.VITE_PAYMASTER_RPC_URL_SEPOLIA,
    bundlerRpcUrl: envVars.VITE_BUNDLER_RPC_URL_SEPOLIA,
  },
  [optimismSepolia.id]: {
    chain: optimismSepolia,
    paymasterRpcUrl: envVars.VITE_PAYMASTER_RPC_URL_OP_SEPOLIA,
    bundlerRpcUrl: envVars.VITE_BUNDLER_RPC_URL_OP_SEPOLIA,
  },
}

export const useChainRpcConfig = () => {
  const chainId = useChainId()
  return aaRpcConfigByChainId[chainId]
}
