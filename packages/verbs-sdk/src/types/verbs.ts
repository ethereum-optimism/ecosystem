<<<<<<< HEAD
import type { LendConfig, LendMarket, LendMarketInfo } from './lending.js'
=======
>>>>>>> 2b0fd5964014635698440155b13ad78f24f47d2a
import type { GetAllWalletsOptions, Wallet } from './wallet.js'

/**
 * Core Verbs SDK interface
 * @description Main interface for interacting with the Verbs SDK
 */
export interface VerbsInterface {
  /**
   * Create a new wallet
   * @param userId - User identifier for the wallet
   * @returns Promise resolving to new wallet instance
   */
  createWallet(userId: string): Promise<Wallet>
  /**
   * Get wallet by user ID
   * @param userId - User identifier
   * @returns Promise resolving to wallet or null if not found
   */
  getWallet(userId: string): Promise<Wallet | null>
  /**
   * Get all wallets
   * @param options - Optional parameters for filtering and pagination
   * @returns Promise resolving to array of wallets
   */
  getAllWallets(options?: GetAllWalletsOptions): Promise<Wallet[]>
<<<<<<< HEAD
  /**
   * Get available lending markets
   * @returns Promise resolving to array of available markets
   */
  getAvailableLendingMarkets(): Promise<LendMarket[]>
  /**
   * Get detailed lending market information
   * @param marketId - Market identifier
   * @returns Promise resolving to detailed market information
   */
  getLendingMarketInfo(marketId: string): Promise<LendMarketInfo>
=======
>>>>>>> 2b0fd5964014635698440155b13ad78f24f47d2a
}

/**
 * Verbs SDK configuration
 * @description Configuration object for initializing the Verbs SDK
 */
export interface VerbsConfig {
  /** Wallet provider configuration */
  wallet: WalletConfig
  /** Lending provider configuration */
  lending?: LendConfig
}

/**
 * Wallet provider configuration
 * @description Configuration for wallet providers
 */
export type WalletConfig = PrivyWalletConfig

/**
 * Privy wallet provider configuration
 * @description Configuration specific to Privy wallet provider
 */
export interface PrivyWalletConfig {
  /** Wallet provider type */
  type: 'privy'
  /** Privy app ID */
  appId: string
  /** Privy app secret */
  appSecret: string
}
