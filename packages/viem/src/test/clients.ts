import {
  createPublicClient,
  createTestClient,
  createWalletClient,
  http,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { optimism } from 'viem/chains'

const RPC_URL = `http://localhost:8545/${Number(process.env.VITEST_vitestPool_ID ?? 1)}`

// anvil account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
export const testAccount = privateKeyToAccount(
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
)

export const publicClient = createPublicClient({
  chain: optimism,
  transport: http(RPC_URL),
})

export const walletClient = createWalletClient({
  account: testAccount,
  chain: optimism,
  transport: http(RPC_URL),
})

export const testClient = createTestClient({
  chain: optimism,
  mode: 'anvil',
  transport: http(RPC_URL),
})
