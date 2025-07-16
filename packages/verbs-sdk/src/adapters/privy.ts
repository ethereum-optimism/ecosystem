import { PrivyClient } from '@privy-io/server-auth'
import type { Address } from 'viem'

import type { WalletProvider } from '../types/wallet.js'
import { Wallet } from '../wallet.js'

/**
 * Privy wallet provider implementation
 * @description Wallet provider implementation using Privy service
 */
export class PrivyWalletProvider implements WalletProvider {
  private privy: PrivyClient
  private chainId: number = 10 // TODO: make configurable

  /**
   * Create a new Privy wallet provider
   * @param appId - Privy application ID
   * @param appSecret - Privy application secret
   */
  constructor(appId: string, appSecret: string) {
    this.privy = new PrivyClient(appId, appSecret)
  }

  /**
   * Create new wallet via Privy
   * @description Creates a new wallet using Privy's wallet API
   * @param userId - User identifier for the wallet
   * @returns Promise resolving to new wallet instance
   * @throws Error if wallet creation fails
   */
  async createWallet(userId: string): Promise<Wallet> {
    try {
      const wallet = await this.privy.walletApi.createWallet({
        chainType: 'ethereum',
      })

      return new Wallet(wallet.id, wallet.address as Address, this.chainId)
    } catch (error) {
      console.error('Error creating wallet:', error)
      throw new Error(`Failed to create wallet for user ${userId}`)
    }
  }

  /**
   * Get wallet by user ID via Privy
   * @description Retrieves wallet information from Privy service
   * @param userId - User identifier
   * @returns Promise resolving to wallet or null if not found
   */
  async getWallet(userId: string): Promise<Wallet | null> {
    try {
      // TODO: Implement proper user-to-wallet lookup
      const wallet = await this.privy.walletApi.getWallet({ id: userId })

      return new Wallet(wallet.id, wallet.address as Address, this.chainId)
    } catch (error) {
      console.error('Error getting wallet:', error)
      return null
    }
  }
}
