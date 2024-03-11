import { envVars } from '@/envVars'
import { http, createConfig } from 'wagmi'
import { sepolia, optimismSepolia, baseSepolia } from 'wagmi/chains'

export const config = createConfig({
  chains: [optimismSepolia, baseSepolia, sepolia],
  transports: {
    [sepolia.id]: http(envVars.VITE_RPC_URL_SEPOLIA),
    [baseSepolia.id]: http(envVars.VITE_RPC_URL_BASE_SEPOLIA),
    [optimismSepolia.id]: http(envVars.VITE_RPC_URL_OP_SEPOLIA),
  },
})
