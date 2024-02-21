import { http } from 'viem'
import { optimism, optimismSepolia } from 'viem/chains'

export const networks = {
  [optimism.id]: {
    chainId: optimism.id,
    transport: http(process.env.JSON_RPC_URL_OP_MAINNET),
  },
  [optimismSepolia.id]: {
    chainId: optimismSepolia.id,
    transport: http(process.env.JSON_RPC_URL_OP_SEPOLIA),
  },
}
