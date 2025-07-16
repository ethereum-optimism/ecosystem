import type { Address } from 'viem'

export interface WalletProvider {
  createWallet(): Promise<Wallet>
  getWallet(walletId: string): Promise<Wallet | null>
}

export interface Wallet extends WalletVerbs {
  id: string
  address: Address
  chainType: number
}

export type WalletVerbs = {
  getBalance(): Promise<bigint>
}
