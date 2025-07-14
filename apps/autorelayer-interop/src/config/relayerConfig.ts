import type { Address, PublicClient, WalletClient } from 'viem'

export interface RelayerConfig {
  ponderInteropApi: string
  clients: Record<string, PublicClient>
  walletClients: Record<string, WalletClient>
  sponsoredTargets?: Array<{ address: Address; chainId: bigint }>
  gasTankAddress?: Address
}
