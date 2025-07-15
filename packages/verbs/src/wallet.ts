import type { Address } from 'viem'

import type {
  VerbsConfig,
  VerbsSDK,
  Wallet as WalletInterface,
} from './types/index.js'
import { Verbs } from './verbs.js'

export class Wallet implements WalletInterface {
  address: Address
  userId: string
  chainId: number

  constructor(address: Address, userId: string, chainId: number) {
    this.address = address
    this.userId = userId
    this.chainId = chainId
  }

  async getBalance(): Promise<bigint> {
    console.log(`Getting balance for wallet ${this.address}`)
    return 0n // Placeholder implementation
  }
}

export function initVerbs(config: VerbsConfig): VerbsSDK {
  return new Verbs(config)
}
