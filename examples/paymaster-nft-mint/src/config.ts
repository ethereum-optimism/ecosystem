import { http, createConfig } from 'wagmi'
import { sepolia, optimismSepolia } from 'wagmi/chains'

export const config = createConfig({
  chains: [optimismSepolia, sepolia],
  transports: {
    [sepolia.id]: http(),
    [optimismSepolia.id]: http(),
  },
})
