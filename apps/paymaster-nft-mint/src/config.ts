import { envVars } from '@/envVars'
import { http, createConfig } from 'wagmi'
import { sepolia, optimismSepolia } from 'wagmi/chains'

export const config = createConfig({
  chains: [optimismSepolia, sepolia],
  transports: {
    [sepolia.id]: http(envVars.VITE_RPC_URL_SEPOLIA),
    [optimismSepolia.id]: http(envVars.VITE_RPC_URL_OP_SEPOLIA),
  },
})
