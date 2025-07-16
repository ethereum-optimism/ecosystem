import { PrivyWalletProvider } from './adapters/privy.js'
import type { VerbsConfig, VerbsInterface } from './types/verbs.js'
import type { WalletProvider } from './types/wallet.js'
import type { Wallet } from './wallet.js'

export class Verbs implements VerbsInterface {
  createWallet!: () => Promise<Wallet>
  getWallet!: (walletId: string) => Promise<Wallet | null>

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

export function initVerbs(config: VerbsConfig): VerbsInterface {
  return new Verbs(config)
}
