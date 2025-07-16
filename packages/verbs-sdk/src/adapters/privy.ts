import { PrivyClient } from '@privy-io/server-auth'
import type { Address } from 'viem'

import type { WalletProvider } from '../types/wallet.js'
import { Wallet } from '../wallet.js'

export class PrivyWalletProvider implements WalletProvider {
  private privy: PrivyClient
  private chainId: number = 10 // TODO: make configurable

  constructor(appId: string, appSecret: string) {
    this.privy = new PrivyClient(appId, appSecret)
  }

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
