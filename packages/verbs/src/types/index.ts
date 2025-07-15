import type { Address } from 'viem'

export interface WalletProvider {
  createWallet(userId: string): Promise<Wallet>
  getWallet(userId: string): Promise<Wallet | null>
}

export interface Wallet {
  address: Address
  userId: string
  chainId: number
  getBalance(): Promise<bigint>
  // transfer(to: Address, amount: bigint): Promise<void>
  // lend(amount: bigint, protocol: string): Promise<void>
  // borrow(amount: bigint, protocol: string): Promise<void>
  // swap(fromAsset: string, toAsset: string, amount: bigint): Promise<void>
  // pay(to: Address, amount: bigint): Promise<void>
}

export interface VerbsConfig {
  wallet: WalletConfig
}

export type WalletConfig = PrivyWalletConfig

export interface PrivyWalletConfig {
  type: 'privy'
  appId: string
  appSecret: string
}

export interface VerbsSDK {
  createWallet(userId: string): Promise<Wallet>
  getWallet(userId: string): Promise<Wallet | null>
}
