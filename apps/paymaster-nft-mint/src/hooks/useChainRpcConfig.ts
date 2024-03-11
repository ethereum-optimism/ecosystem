import { envVars } from '@/envVars'
import { Chain, baseSepolia, optimismSepolia, sepolia } from 'viem/chains'
import { useChainId } from 'wagmi'

const aaRpcConfigByChainId: Record<
  number,
  {
    chain: Chain
    rpcUrl: string
    paymasterRpcUrl: string
    bundlerRpcUrl: string
  }
> = {
  [sepolia.id]: {
    chain: sepolia,
    rpcUrl: envVars.VITE_RPC_URL_SEPOLIA,
    paymasterRpcUrl: envVars.VITE_PAYMASTER_RPC_URL_SEPOLIA,
    bundlerRpcUrl: envVars.VITE_BUNDLER_RPC_URL_SEPOLIA,
  },
  [baseSepolia.id]: {
    chain: baseSepolia,
    paymasterRpcUrl: envVars.VITE_PAYMASTER_RPC_URL_BASE_SEPOLIA,
    bundlerRpcUrl: envVars.VITE_BUNDLER_RPC_URL_BASE_SEPOLIA,
  },
  [optimismSepolia.id]: {
    chain: optimismSepolia,
    rpcUrl: envVars.VITE_RPC_URL_OP_SEPOLIA,
    paymasterRpcUrl: envVars.VITE_PAYMASTER_RPC_URL_OP_SEPOLIA,
    bundlerRpcUrl: envVars.VITE_BUNDLER_RPC_URL_OP_SEPOLIA,
  },
}

export const useChainRpcConfig = () => {
  const chainId = useChainId()
  return aaRpcConfigByChainId[chainId]
}
