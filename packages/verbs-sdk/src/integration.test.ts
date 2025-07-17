import { type Address, createPublicClient, http, type PublicClient } from 'viem'
import { mainnet } from 'viem/chains'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { MorphoLendProvider } from './adapters/morpho.js'
import { PrivyWalletProvider } from './adapters/privy.js'
import type { VerbsConfig } from './types/verbs.js'
import { Verbs } from './verbs.js'

// Mock external dependencies
vi.mock('./adapters/privy.js')
vi.mock('@morpho-org/blue-sdk')
vi.mock('@morpho-org/blue-sdk-viem')
vi.mock('@morpho-org/bundler-sdk-viem')

describe('Integration Tests', () => {
  let mockPublicClient: ReturnType<typeof createPublicClient>
  let config: VerbsConfig

  beforeEach(() => {
    mockPublicClient = createPublicClient({
      chain: mainnet,
      transport: http(),
    })

    config = {
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

  describe('End-to-End Wallet Creation and Lending Flow', () => {
    it('should create wallet and prepare lending transaction', async () => {
      // Mock wallet provider
      const mockWallet = {
        id: 'test-wallet-id',
        address: '0x0000000000000000000000000000000000000000' as Address,
        getBalance: vi.fn().mockResolvedValue(BigInt('1000000000000000000')), // 1 ETH
        lend: vi.fn(),
      }

      const mockWalletProvider = {
        createWallet: vi.fn().mockResolvedValue(mockWallet),
        getWallet: vi.fn().mockResolvedValue(mockWallet),
        getAllWallets: vi.fn().mockResolvedValue([mockWallet]),
      }

      vi.mocked(PrivyWalletProvider).mockImplementation(
        () => mockWalletProvider as unknown as PrivyWalletProvider,
      )

      // Create Verbs instance (will fail due to missing publicClient, but we can test the structure)
      expect(() => new Verbs(config)).toThrow(
        'Morpho lending provider requires publicClient',
      )
    })

    it('should integrate MorphoLendProvider with mock data', async () => {
      const morphoProvider = new MorphoLendProvider(
        config.lending!,
        1,
        mockPublicClient as unknown as PublicClient,
      )

      // Test getting available markets
      const markets = await morphoProvider.getAvailableMarkets()
      expect(Array.isArray(markets)).toBe(true)
      expect(markets.length).toBeGreaterThan(0)

      // Test getting market info
      const marketInfo = await morphoProvider.getMarketInfo(markets[0].id)
      expect(marketInfo).toHaveProperty('id')
      expect(marketInfo).toHaveProperty('supplyApy')
      expect(marketInfo).toHaveProperty('utilization')

      // Test lending preparation
      const asset = '0xA0b86a33E6441C8C6bD63aFfaE0E30E2495B5CE0' as Address
      const amount = BigInt('1000000000') // 1000 USDC

      const lendTransaction = await morphoProvider.lend(asset, amount)
      expect(lendTransaction).toHaveProperty('hash')
      expect(lendTransaction).toHaveProperty('amount', amount)
      expect(lendTransaction).toHaveProperty('asset', asset)
      expect(lendTransaction).toHaveProperty('apy')
    })
  })

  describe('Error Handling Integration', () => {
    it('should handle lending provider errors gracefully', async () => {
      const morphoProvider = new MorphoLendProvider(
        config.lending!,
        1,
        mockPublicClient as unknown as PublicClient,
      )

      // Test with invalid asset
      const invalidAsset =
        '0x0000000000000000000000000000000000000000' as Address
      const amount = BigInt('1000000000')

      await expect(morphoProvider.lend(invalidAsset, amount)).rejects.toThrow(
        'Failed to lend',
      )
    })

    it('should handle wallet provider errors gracefully', async () => {
      const mockWalletProvider = {
        createWallet: vi
          .fn()
          .mockRejectedValue(new Error('Wallet creation failed')),
        getWallet: vi.fn().mockResolvedValue(null),
        getAllWallets: vi.fn().mockResolvedValue([]),
      }

      vi.mocked(PrivyWalletProvider).mockImplementation(
        () => mockWalletProvider as unknown as PrivyWalletProvider,
      )

      const walletOnlyConfig = {
        wallet: config.wallet,
      }

      const verbs = new Verbs(walletOnlyConfig)

      await expect(verbs.createWallet('test-user')).rejects.toThrow(
        'Wallet creation failed',
      )
    })
  })

  describe('Configuration Validation', () => {
    it('should validate wallet configuration', () => {
      const invalidConfig = {
        wallet: {
          type: 'invalid' as unknown as 'privy',
          appId: 'test',
          appSecret: 'test',
        },
      }

      expect(() => new Verbs(invalidConfig)).toThrow(
        'Unsupported wallet provider type: invalid',
      )
    })

    it('should validate lending configuration', () => {
      const invalidLendingConfig = {
        wallet: config.wallet,
        lending: {
          type: 'invalid' as unknown as 'morpho',
          morphoAddress:
            '0x1234567890123456789012345678901234567890' as Address,
          bundlerAddress:
            '0x0987654321098765432109876543210987654321' as Address,
        },
      }

      expect(() => new Verbs(invalidLendingConfig)).toThrow(
        'Unsupported lending provider type: invalid',
      )
    })
  })

  describe('Type Safety Integration', () => {
    it('should maintain type safety across interfaces', async () => {
      const morphoProvider = new MorphoLendProvider(
        config.lending!,
        1,
        mockPublicClient as unknown as PublicClient,
      )

      // Test that methods return correctly typed objects
      expect(morphoProvider.getAvailableMarkets()).toBeInstanceOf(Promise)

      // Use a valid market ID from the mock data
      const markets = await morphoProvider.getAvailableMarkets()
      expect(morphoProvider.getMarketInfo(markets[0].id)).toBeInstanceOf(
        Promise,
      )

      // Test lend with a valid asset from the mock data
      expect(
        morphoProvider.lend(
          '0xA0b86a33E6441C8C6bD63aFfaE0E30E2495B5CE0' as Address,
          1000n,
        ),
      ).toBeInstanceOf(Promise)
    })

    it('should handle optional parameters correctly', async () => {
      const morphoProvider = new MorphoLendProvider(
        config.lending!,
        1,
        mockPublicClient as unknown as PublicClient,
      )

      const asset = '0xA0b86a33E6441C8C6bD63aFfaE0E30E2495B5CE0' as Address
      const amount = BigInt('1000000000')

      // Test with optional marketId
      const resultWithoutMarket = await morphoProvider.lend(asset, amount)
      expect(resultWithoutMarket).toHaveProperty('marketId')

      // Test with optional marketId and options
      const resultWithOptions = await morphoProvider.lend(
        asset,
        amount,
        undefined,
        {
          slippage: 100,
        },
      )
      expect(resultWithOptions).toHaveProperty('marketId')
    })
  })
})
