import { PrivyWalletProvider } from './adapters/privy.js'
import type { VerbsConfig, VerbsSDK, WalletProvider } from './types/index.js'
import { Wallet } from './wallet.js'

export class Verbs implements VerbsSDK {
  private provider: WalletProvider

  constructor(config: VerbsConfig) {
    this.provider = this.createWalletProvider(config)
  }

  private createWalletProvider(config: VerbsConfig): WalletProvider {
    const { walletConfig } = config

    switch (walletConfig.type) {
      case 'privy':
        return new PrivyWalletProvider(
          walletConfig.appId,
          walletConfig.appSecret,
        )
      default:
        throw new Error(
          `Unsupported wallet provider type: ${walletConfig.type}`,
        )
    }
  }

  async createWallet(userId: string): Promise<Wallet> {
    const walletData = await this.provider.createWallet(userId)
    console.log(`Wallet created for user ${userId}: ${walletData.address}`)
    return new Wallet(walletData.address, walletData.userId, walletData.chainId)
  }

  async getWallet(userId: string): Promise<Wallet | null> {
    const walletData = await this.provider.getWallet(userId)
    if (!walletData) {
      return null
    }
    console.log(`Wallet retrieved for user ${userId}: ${walletData.address}`)
    return new Wallet(walletData.address, walletData.userId, walletData.chainId)
  }
}
