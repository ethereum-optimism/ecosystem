import type { Wallet } from './wallet.js'

/**
 * Core Verbs SDK interface
 * @description Main interface for interacting with the Verbs SDK
 */
export interface VerbsInterface {
  /**
   * Create a new wallet
   * @returns Promise resolving to new wallet instance
   */
  createWallet(): Promise<Wallet>
  /**
   * Get wallet by ID
   * @param walletId - Unique wallet identifier
   * @returns Promise resolving to wallet or null if not found
   */
  getWallet(walletId: string): Promise<Wallet | null>
}

/**
 * Verbs SDK configuration
 * @description Configuration object for initializing the Verbs SDK
 */
export interface VerbsConfig {
  /** Wallet provider configuration */
  wallet: {
    /** Wallet provider type */
    type: 'privy'
    /** Privy app ID */
    appId: string
    /** Privy app secret */
    appSecret: string
  }
}
