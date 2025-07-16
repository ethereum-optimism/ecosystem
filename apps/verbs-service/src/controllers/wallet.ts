import type { Context } from 'hono'

import * as walletService from '../services/wallet.js'

export class WalletController {
  async createWallet(c: Context) {
    try {
      const wallet = await walletService.createWallet('user-123') // TODO: placeholder

      return c.json({
        message: 'Wallet created successfully',
        address: wallet.address,
        userId: 'user-123', // TODO: placeholder
      })
    } catch (error) {
      return c.json(
        {
          error: 'Failed to create wallet',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        500,
      )
    }
  }
}
