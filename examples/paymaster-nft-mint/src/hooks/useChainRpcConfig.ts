import { Chain, optimismSepolia, sepolia } from 'viem/chains'
import { useChainId } from 'wagmi'

const aaRpcConfigByChainId: Record<
  number,
  { chain: Chain; paymasterRpcUrl: string; bundlerRpcUrl: string }
> = {
  [sepolia.id]: {
    chain: sepolia,
    paymasterRpcUrl: 'http://localhost:7310/v1/11155111/rpc',
    bundlerRpcUrl: import.meta.env.VITE_BUNDLER_RPC_URL_SEPOLIA!,
  },
  [optimismSepolia.id]: {
    chain: optimismSepolia,
    paymasterRpcUrl: 'http://localhost:7310/v1/11155420/rpc',
    bundlerRpcUrl: import.meta.env.VITE_BUNDLER_RPC_URL_OP_SEPOLIA!,
  },
}

export const useChainRpcConfig = () => {
  const chainId = useChainId()
  return aaRpcConfigByChainId[chainId]
}
