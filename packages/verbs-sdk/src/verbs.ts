import { PrivyWalletProvider } from './adapters/privy.js'
import type { VerbsConfig, VerbsInterface } from './types/verbs.js'
import type { WalletProvider } from './types/wallet.js'
import type { Wallet } from './wallet.js'

/**
 * Main Verbs SDK class
 * @description Core implementation of the Verbs SDK
 */
export class Verbs implements VerbsInterface {
  createWallet!: (userId: string) => Promise<Wallet>
  getWallet!: (userId: string) => Promise<Wallet | null>

  private walletProvider: WalletProvider

  constructor(config: VerbsConfig) {
    this.walletProvider = this.createWalletProvider(config)

    // Delegate wallet methods to wallet provider
    this.createWallet = this.walletProvider.createWallet.bind(this.walletProvider)
    this.getWallet = this.walletProvider.getWallet.bind(this.walletProvider)
  }

  private createWalletProvider(config: VerbsConfig): WalletProvider {
    const { wallet } = config

    switch (wallet.type) {
      case 'privy':
        return new PrivyWalletProvider(wallet.appId, wallet.appSecret)
      default:
        throw new Error(`Unsupported wallet provider type: ${wallet.type}`)
    }
  }
}

/**
 * Initialize Verbs SDK
 * @description Factory function to create a new Verbs SDK instance
 * @param config - SDK configuration
 * @returns Initialized Verbs SDK instance
 */
export function initVerbs(config: VerbsConfig): VerbsInterface {
  return new Verbs(config)
}
