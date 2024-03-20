import { fraxtalSepolia } from '@/constants/fraxtalSepolia'
import { envVars } from '@/envVars'
import { http, createConfig } from 'wagmi'
import {
  sepolia,
  optimismSepolia,
  zoraSepolia,
  baseSepolia,
} from 'wagmi/chains'

export const config = createConfig({
  chains: [optimismSepolia, zoraSepolia, baseSepolia, fraxtalSepolia, sepolia],
  transports: {
    [sepolia.id]: http(envVars.VITE_RPC_URL_SEPOLIA),
    [optimismSepolia.id]: http(envVars.VITE_RPC_URL_OP_SEPOLIA),
    [zoraSepolia.id]: http(envVars.VITE_RPC_URL_ZORA_SEPOLIA),
    [baseSepolia.id]: http(envVars.VITE_RPC_URL_BASE_SEPOLIA),
    [fraxtalSepolia.id]: http(envVars.VITE_RPC_URL_FRAXTAL_SEPOLIA),
  },
})
