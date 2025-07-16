import type { Address } from 'viem'

import type { Wallet as WalletInterface } from './types/wallet.js'

export class Wallet implements WalletInterface {
  id: string
  address: Address
  chainType: number

  constructor(id: string, address: Address, chainType: number) {
    this.id = id
    this.address = address
    this.chainType = chainType
  }

  async getBalance(): Promise<bigint> {
    console.log(`Getting balance for wallet ${this.address}`)
    return 0n // Placeholder implementation
  }
}
