import { PrivyClient } from '@privy-io/server-auth'
import type { Address } from 'viem'

import type { Wallet, WalletProvider } from '../types/index.js'

export class PrivyWalletProvider implements WalletProvider {
  private privy: PrivyClient
  private chainId: number = 10 // TODO: make configurable

  constructor(appId: string, appSecret: string) {
    this.privy = new PrivyClient(appId, appSecret)
  }

  async createWallet(userId: string): Promise<Wallet> {
    try {
      const { address } = await this.privy.walletApi.createWallet({
        chainType: 'ethereum',
      })

      return {
        address: address as Address,
        userId,
        chainId: this.chainId,
        getBalance: async () => 0n, // TODO placeholder
      }
    } catch (error) {
      console.error('Error creating wallet:', error)
      throw new Error(`Failed to create wallet for user ${userId}`)
    }
  }

  async getWallet(userId: string): Promise<Wallet | null> {
    try {
      const { address } = await this.privy.walletApi.createWallet({
        chainType: 'ethereum',
      })

      return {
        address: address as Address,
        userId,
        chainId: this.chainId,
        getBalance: async () => 0n, // TODO placeholder
      }
    } catch (error) {
      console.error('Error getting wallet:', error)
      return null
    }
  }
}
