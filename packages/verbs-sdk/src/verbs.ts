import { PrivyWalletProvider } from './adapters/privy.js'
import type {
  LendMarket,
  LendMarketInfo,
  LendProvider,
} from './types/lending.js'
import type { VerbsConfig, VerbsInterface } from './types/verbs.js'
import type { GetAllWalletsOptions, WalletProvider } from './types/wallet.js'
import type { Wallet } from './wallet.js'

/**
 * Main Verbs SDK class
 * @description Core implementation of the Verbs SDK
 */
export class Verbs implements VerbsInterface {
  createWallet!: (userId: string) => Promise<Wallet>
  getWallet!: (userId: string) => Promise<Wallet | null>
  getAllWallets!: (options?: GetAllWalletsOptions) => Promise<Wallet[]>
  getAvailableLendingMarkets!: () => Promise<LendMarket[]>
  getLendingMarketInfo!: (marketId: string) => Promise<LendMarketInfo>

  private walletProvider: WalletProvider
  private lendProvider?: LendProvider

  constructor(config: VerbsConfig) {
    this.walletProvider = this.createWalletProvider(config)
    this.lendProvider = config.lending
      ? this.createLendProvider(config)
      : undefined

    // Delegate wallet methods to wallet provider
    this.createWallet = this.walletProvider.createWallet.bind(
      this.walletProvider,
    )
    this.getWallet = this.walletProvider.getWallet.bind(this.walletProvider)
    this.getAllWallets = this.walletProvider.getAllWallets.bind(
      this.walletProvider,
    )

    // Delegate lending methods to lending provider
    this.getAvailableLendingMarkets =
      this.lendProvider?.getAvailableMarkets.bind(this.lendProvider) ||
      this.throwLendingNotConfigured
    this.getLendingMarketInfo =
      this.lendProvider?.getMarketInfo.bind(this.lendProvider) ||
      this.throwLendingNotConfigured
  }

  /**
   * Get the lending provider instance
   * @returns LendProvider instance or undefined if not configured
   */
  getLendProvider(): LendProvider | undefined {
    return this.lendProvider
  }

  /**
   * Throw error when lending is not configured
   */
  private throwLendingNotConfigured(): Promise<never> {
    return Promise.reject(
      new Error(
        'Lending provider not configured. Add lending configuration to VerbsConfig.',
      ),
    )
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

  private createLendProvider(config: VerbsConfig): LendProvider {
    const { lending } = config

    if (!lending) {
      throw new Error('Lending configuration is required')
    }

    switch (lending.type) {
      case 'morpho':
        // TODO: Need to get publicClient from somewhere
        // For now, this is a placeholder that will need to be refactored
        throw new Error(
          'Morpho lending provider requires publicClient - implementation pending',
        )
      default:
        throw new Error(`Unsupported lending provider type: ${lending.type}`)
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
