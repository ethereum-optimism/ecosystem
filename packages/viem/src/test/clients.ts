import { createPublicClient, createTestClient, http } from 'viem'
import { optimism } from 'viem/chains'

const RPC_URL = 'http://127.0.0.1:8545'

export const publicClient = createPublicClient({
  chain: optimism,
  transport: http(RPC_URL),
})

export const testClient = createTestClient({
  chain: optimism,
  mode: 'anvil',
  transport: http(RPC_URL),
})
