import type { Wallet } from './wallet.js'

export interface VerbsInterface {
  createWallet(): Promise<Wallet>
  getWallet(walletId: string): Promise<Wallet | null>
}

export interface VerbsConfig {
  wallet: {
    type: 'privy'
    appId: string
    appSecret: string
  }
}
