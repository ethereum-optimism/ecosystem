import { type Address } from 'viem'
import { beforeEach, describe, expect, it } from 'vitest'

import { Wallet } from './wallet.js'

describe('Wallet', () => {
  let wallet: Wallet

  beforeEach(() => {
    wallet = new Wallet('test-wallet-id')
  })

  describe('constructor', () => {
    it('should create wallet with correct properties', () => {
      expect(wallet.id).toBe('test-wallet-id')
      expect(wallet.address).toBe('0x0000000000000000000000000000000000000000')
    })
  })

  describe('getBalance', () => {
    it('should return placeholder balance', async () => {
      const balance = await wallet.getBalance()
      expect(balance).toBe(0n)
    })
  })

  describe('lend', () => {
    it('should throw error indicating implementation needed', async () => {
      const asset = '0xA0b86a33E6441C8C6bD63aFfaE0E30E2495B5CE0' as Address
      const amount = BigInt('1000000000')

      await expect(wallet.lend(asset, amount)).rejects.toThrow(
        'Lending delegation not yet implemented - requires VerbsInterface integration',
      )
    })

    it('should throw error with marketId parameter', async () => {
      const asset = '0xA0b86a33E6441C8C6bD63aFfaE0E30E2495B5CE0' as Address
      const amount = BigInt('1000000000')
      const marketId =
        '0x1111111111111111111111111111111111111111111111111111111111111111'

      await expect(wallet.lend(asset, amount, marketId)).rejects.toThrow(
        'Lending delegation not yet implemented - requires VerbsInterface integration',
      )
    })
  })

  describe('interface compliance', () => {
    it('should implement WalletInterface methods', () => {
      expect(wallet.getBalance).toBeDefined()
      expect(wallet.lend).toBeDefined()
      expect(typeof wallet.getBalance).toBe('function')
      expect(typeof wallet.lend).toBe('function')
    })

    it('should have required properties', () => {
      expect(wallet.id).toBeDefined()
      expect(wallet.address).toBeDefined()
      expect(typeof wallet.id).toBe('string')
      expect(typeof wallet.address).toBe('string')
    })
  })
})
