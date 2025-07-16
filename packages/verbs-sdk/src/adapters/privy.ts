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
   * @returns Promise resolving to new wallet instance
   * @throws Error if wallet creation fails
   */
  async createWallet(): Promise<Wallet> {
    try {
      const wallet = await this.privy.walletApi.createWallet({
        chainType: 'ethereum',
      })

      return new Wallet(wallet.id, wallet.address as Address, this.chainId)
    } catch (error) {
      console.error('Error creating wallet:', error)
      throw new Error('Failed to create wallet')
    }
  }

  /**
   * Get wallet by ID via Privy
   * @description Retrieves wallet information from Privy service
   * @param walletId - Unique wallet identifier
   * @returns Promise resolving to wallet or null if not found
   */
  async getWallet(walletId: string): Promise<Wallet | null> {
    try {
      const wallet = await this.privy.walletApi.getWallet({ id: walletId })

      return new Wallet(wallet.id, wallet.address as Address, this.chainId)
    } catch (error) {
      console.error('Error getting wallet:', error)
      return null
    }
  }
}
