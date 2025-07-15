import type { Address, PublicClient, WalletClient } from 'viem'

export interface RelayerConfig {
  ponderInteropApi: string
  clients: Record<number, PublicClient>
  walletClients: Record<number, WalletClient>
  sponsoredTargets?: Array<{ address: Address; chainId: bigint }>
  gasTankAddress?: Address
}
