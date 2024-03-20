import { fraxtalSepolia } from '@/constants/fraxtalSepolia'
import { envVars } from '@/envVars'
import {
  Chain,
  baseSepolia,
  optimismSepolia,
  sepolia,
  zoraSepolia,
} from 'viem/chains'
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
  [zoraSepolia.id]: {
    chain: zoraSepolia,
    rpcUrl: envVars.VITE_RPC_URL_ZORA_SEPOLIA,
    paymasterRpcUrl: envVars.VITE_PAYMASTER_RPC_URL_ZORA_SEPOLIA,
    bundlerRpcUrl: envVars.VITE_BUNDLER_RPC_URL_ZORA_SEPOLIA,
  },
  [optimismSepolia.id]: {
    chain: optimismSepolia,
    rpcUrl: envVars.VITE_RPC_URL_OP_SEPOLIA,
    paymasterRpcUrl: envVars.VITE_PAYMASTER_RPC_URL_OP_SEPOLIA,
    bundlerRpcUrl: envVars.VITE_BUNDLER_RPC_URL_OP_SEPOLIA,
  },
  [fraxtalSepolia.id]: {
    chain: fraxtalSepolia,
    rpcUrl: envVars.VITE_RPC_URL_FRAXTAL_SEPOLIA,
    paymasterRpcUrl: envVars.VITE_PAYMASTER_RPC_URL_FRAXTAL_SEPOLIA,
    bundlerRpcUrl: envVars.VITE_BUNDLER_RPC_URL_FRAXTAL_SEPOLIA,
  },
  [baseSepolia.id]: {
    chain: baseSepolia,
    rpcUrl: envVars.VITE_RPC_URL_BASE_SEPOLIA,
    paymasterRpcUrl: envVars.VITE_PAYMASTER_RPC_URL_BASE_SEPOLIA,
    bundlerRpcUrl: envVars.VITE_BUNDLER_RPC_URL_BASE_SEPOLIA,
  },
}

export const useChainRpcConfig = () => {
  const chainId = useChainId()
  return aaRpcConfigByChainId[chainId]
}
