import type { Address } from 'viem'

/**
 * Wallet provider interface
 * @description Interface for wallet provider implementations
 */
export interface WalletProvider {
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
 * Wallet interface
 * @description Core wallet interface with blockchain properties and verbs
 */
export interface Wallet extends WalletVerbs {
  /** Wallet ID */
  id: string
  /** Wallet address */
  address: Address
  /** Chain type */
  chainType: number
}

/**
 * Wallet verbs/actions
 * @description Available actions that can be performed on a wallet
 */
export type WalletVerbs = {
  /**
   * Get wallet balance
   * @returns Promise resolving to wallet balance in wei
   */
  getBalance(): Promise<bigint>
}
