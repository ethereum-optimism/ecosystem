import { envVars } from '@/envVars'
import { http, createConfig } from 'wagmi'
import { sepolia, optimismSepolia, zoraSepolia } from 'wagmi/chains'

export const config = createConfig({
  chains: [optimismSepolia, zoraSepolia, sepolia],
  transports: {
    [sepolia.id]: http(envVars.VITE_RPC_URL_SEPOLIA),
    [optimismSepolia.id]: http(envVars.VITE_RPC_URL_OP_SEPOLIA),
    [zoraSepolia.id]: http(envVars.VITE_RPC_URL_ZORA_SEPOLIA),
  },
})
