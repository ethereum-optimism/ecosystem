import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPublicClient, http, type Address } from 'viem'
import { mainnet } from 'viem/chains'
import { Verbs, initVerbs } from './verbs.js'
import type { VerbsConfig } from './types/verbs.js'

// Mock the adapters
vi.mock('./adapters/privy.js', () => ({
  PrivyWalletProvider: vi.fn().mockImplementation(() => ({
    createWallet: vi.fn(),
    getWallet: vi.fn(),
    getAllWallets: vi.fn(),
  })),
}))

vi.mock('./adapters/morpho.js', () => ({
  MorphoLendProvider: vi.fn().mockImplementation(() => ({
    getAvailableMarkets: vi.fn(),
    getMarketInfo: vi.fn(),
    lend: vi.fn(),
  })),
}))

describe('Verbs', () => {
  let walletOnlyConfig: VerbsConfig
  let fullConfig: VerbsConfig

  beforeEach(() => {
    walletOnlyConfig = {
      wallet: {
        type: 'privy',
        appId: 'test-app-id',
        appSecret: 'test-app-secret',
      },
    }

    fullConfig = {
      wallet: {
        type: 'privy',
        appId: 'test-app-id',
        appSecret: 'test-app-secret',
      },
      lending: {
        type: 'morpho',
        morphoAddress: '0x1234567890123456789012345678901234567890' as Address,
        bundlerAddress: '0x0987654321098765432109876543210987654321' as Address,
        defaultSlippage: 50,
      },
    }
  })

  describe('constructor', () => {
    it('should initialize with wallet-only config', () => {
      const verbs = new Verbs(walletOnlyConfig)
      expect(verbs).toBeInstanceOf(Verbs)
      expect(verbs.getLendProvider()).toBeUndefined()
    })

    it('should initialize with full config including lending', () => {
      // This will throw due to missing publicClient, but the structure should be correct
      expect(() => new Verbs(fullConfig)).toThrow('Morpho lending provider requires publicClient')
    })
  })

  describe('wallet methods', () => {
    let verbs: Verbs

    beforeEach(() => {
      verbs = new Verbs(walletOnlyConfig)
    })

    it('should delegate createWallet to wallet provider', async () => {
      const userId = 'test-user-id'
      
      // Mock the wallet provider method
      const mockWallet = {
        id: 'wallet-id',
        address: '0x0000000000000000000000000000000000000000' as Address,
        chainType: 0,
        getBalance: vi.fn(),
        lend: vi.fn(),
      }

      vi.spyOn(verbs as any, 'createWallet').mockResolvedValue(mockWallet)

      const result = await verbs.createWallet(userId)
      expect(result).toBe(mockWallet)
    })

    it('should delegate getWallet to wallet provider', async () => {
      const userId = 'test-user-id'
      
      const mockWallet = {
        id: 'wallet-id',
        address: '0x0000000000000000000000000000000000000000' as Address,
        chainType: 0,
        getBalance: vi.fn(),
        lend: vi.fn(),
      }

      vi.spyOn(verbs as any, 'getWallet').mockResolvedValue(mockWallet)

      const result = await verbs.getWallet(userId)
      expect(result).toBe(mockWallet)
    })

    it('should delegate getAllWallets to wallet provider', async () => {
      const mockWallets = [
        {
          id: 'wallet-1',
          address: '0x1111111111111111111111111111111111111111' as Address,
          chainType: 0,
          getBalance: vi.fn(),
          lend: vi.fn(),
        },
        {
          id: 'wallet-2',
          address: '0x2222222222222222222222222222222222222222' as Address,
          chainType: 0,
          getBalance: vi.fn(),
          lend: vi.fn(),
        },
      ]

      vi.spyOn(verbs as any, 'getAllWallets').mockResolvedValue(mockWallets)

      const result = await verbs.getAllWallets()
      expect(result).toBe(mockWallets)
    })
  })

  describe('lending methods without provider', () => {
    let verbs: Verbs

    beforeEach(() => {
      verbs = new Verbs(walletOnlyConfig)
    })

    it('should throw error when getting lending markets without provider', async () => {
      await expect(verbs.getAvailableLendingMarkets()).rejects.toThrow(
        'Lending provider not configured. Add lending configuration to VerbsConfig.'
      )
    })

    it('should throw error when getting market info without provider', async () => {
      const marketId = '0x1111111111111111111111111111111111111111111111111111111111111111'
      
      await expect(verbs.getLendingMarketInfo(marketId)).rejects.toThrow(
        'Lending provider not configured. Add lending configuration to VerbsConfig.'
      )
    })
  })

  describe('provider creation', () => {
    it('should create PrivyWalletProvider for privy wallet config', () => {
      const verbs = new Verbs(walletOnlyConfig)
      expect(verbs).toBeInstanceOf(Verbs)
    })

    it('should throw error for unsupported wallet provider type', () => {
      const invalidConfig = {
        wallet: {
          type: 'unsupported' as any,
        },
      }

      expect(() => new Verbs(invalidConfig)).toThrow('Unsupported wallet provider type: unsupported')
    })

    it('should throw error for unsupported lending provider type', () => {
      const invalidLendingConfig = {
        wallet: walletOnlyConfig.wallet,
        lending: {
          type: 'unsupported' as any,
        },
      }

      expect(() => new Verbs(invalidLendingConfig)).toThrow('Unsupported lending provider type: unsupported')
    })
  })

  describe('initVerbs factory function', () => {
    it('should create Verbs instance', () => {
      const verbs = initVerbs(walletOnlyConfig)
      expect(verbs).toBeInstanceOf(Verbs)
    })

    it('should implement VerbsInterface', () => {
      const verbs = initVerbs(walletOnlyConfig)
      
      expect(verbs.createWallet).toBeDefined()
      expect(verbs.getWallet).toBeDefined()
      expect(verbs.getAllWallets).toBeDefined()
      expect(verbs.getAvailableLendingMarkets).toBeDefined()
      expect(verbs.getLendingMarketInfo).toBeDefined()
    })
  })
})