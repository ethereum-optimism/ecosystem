import { describe, it, expect, beforeEach, vi, type MockedFunction } from 'vitest'
import { createPublicClient, http, type Address } from 'viem'
import { mainnet } from 'viem/chains'
import { MorphoLendProvider } from './morpho.js'
import type { MorphoLendConfig } from '../types/lending.js'

// Mock the Morpho SDK modules
vi.mock('@morpho-org/blue-sdk', () => ({
  Market: {
    fetch: vi.fn(),
  },
}))

vi.mock('@morpho-org/blue-sdk-viem', () => ({
  MarketConfig: {
    fetch: vi.fn(),
  },
}))

vi.mock('@morpho-org/bundler-sdk-viem', () => ({
  populateBundle: vi.fn(),
  finalizeBundle: vi.fn(),
  encodeBundle: vi.fn(),
}))

describe('MorphoLendProvider', () => {
  let provider: MorphoLendProvider
  let mockConfig: MorphoLendConfig
  let mockPublicClient: ReturnType<typeof createPublicClient>

  beforeEach(() => {
    mockConfig = {
      type: 'morpho',
      morphoAddress: '0x1234567890123456789012345678901234567890' as Address,
      bundlerAddress: '0x0987654321098765432109876543210987654321' as Address,
      defaultSlippage: 50,
    }

    mockPublicClient = createPublicClient({
      chain: mainnet,
      transport: http(),
    })

    provider = new MorphoLendProvider(mockConfig, 1, mockPublicClient)
  })

  describe('constructor', () => {
    it('should initialize with provided config', () => {
      expect(provider).toBeInstanceOf(MorphoLendProvider)
    })

    it('should use default slippage when not provided', () => {
      const configWithoutSlippage = {
        ...mockConfig,
        defaultSlippage: undefined,
      }
      const providerWithDefaults = new MorphoLendProvider(configWithoutSlippage, 1, mockPublicClient)
      expect(providerWithDefaults).toBeInstanceOf(MorphoLendProvider)
    })
  })

  describe('getAvailableMarkets', () => {
    it('should return available markets', async () => {
      const markets = await provider.getAvailableMarkets()
      expect(markets).toBeArray()
      expect(markets.length).toBeGreaterThan(0)
      
      const market = markets[0]
      expect(market).toHaveProperty('id')
      expect(market).toHaveProperty('name')
      expect(market).toHaveProperty('loanToken')
      expect(market).toHaveProperty('collateralToken')
      expect(market).toHaveProperty('supplyApy')
      expect(market).toHaveProperty('utilization')
      expect(market).toHaveProperty('liquidity')
    })

    it('should handle errors gracefully', async () => {
      // Mock a provider that throws an error
      const failingProvider = new MorphoLendProvider(mockConfig, 1, mockPublicClient)
      
      // Override the private method to simulate an error
      ;(failingProvider as any).fetchMarketConfigs = vi.fn().mockRejectedValue(new Error('Network error'))
      
      await expect(failingProvider.getAvailableMarkets()).rejects.toThrow('Failed to fetch available markets')
    })
  })

  describe('getMarketInfo', () => {
    it('should return detailed market information', async () => {
      const marketId = '0x1111111111111111111111111111111111111111111111111111111111111111'
      
      const marketInfo = await provider.getMarketInfo(marketId)
      
      expect(marketInfo).toHaveProperty('id', marketId)
      expect(marketInfo).toHaveProperty('name')
      expect(marketInfo).toHaveProperty('loanToken')
      expect(marketInfo).toHaveProperty('collateralToken')
      expect(marketInfo).toHaveProperty('supplyApy')
      expect(marketInfo).toHaveProperty('utilization')
      expect(marketInfo).toHaveProperty('liquidity')
      expect(marketInfo).toHaveProperty('oracle')
      expect(marketInfo).toHaveProperty('irm')
      expect(marketInfo).toHaveProperty('lltv')
      expect(marketInfo).toHaveProperty('totalSupply')
      expect(marketInfo).toHaveProperty('totalBorrow')
      expect(marketInfo).toHaveProperty('supplyRate')
      expect(marketInfo).toHaveProperty('borrowRate')
      expect(marketInfo).toHaveProperty('lastUpdate')
    })

    it('should handle market not found error', async () => {
      const invalidMarketId = '0x0000000000000000000000000000000000000000000000000000000000000000'
      
      await expect(provider.getMarketInfo(invalidMarketId)).rejects.toThrow(`Failed to get market info for ${invalidMarketId}`)
    })
  })

  describe('lend', () => {
    it('should successfully create a lending transaction', async () => {
      const asset = '0xA0b86a33E6441C8C6bD63aFfaE0E30E2495B5CE0' as Address // USDC
      const amount = BigInt('1000000000') // 1000 USDC
      const marketId = '0x1111111111111111111111111111111111111111111111111111111111111111'

      const lendTransaction = await provider.lend(asset, amount, marketId)

      expect(lendTransaction).toHaveProperty('hash')
      expect(lendTransaction).toHaveProperty('amount', amount)
      expect(lendTransaction).toHaveProperty('asset', asset)
      expect(lendTransaction).toHaveProperty('marketId', marketId)
      expect(lendTransaction).toHaveProperty('apy')
      expect(lendTransaction).toHaveProperty('timestamp')
      expect(typeof lendTransaction.apy).toBe('number')
      expect(lendTransaction.apy).toBeGreaterThan(0)
    })

    it('should find best market when marketId not provided', async () => {
      const asset = '0xA0b86a33E6441C8C6bD63aFfaE0E30E2495B5CE0' as Address // USDC
      const amount = BigInt('1000000000') // 1000 USDC

      const lendTransaction = await provider.lend(asset, amount)

      expect(lendTransaction).toHaveProperty('marketId')
      expect(lendTransaction.marketId).toBeTruthy()
    })

    it('should handle lending errors', async () => {
      const asset = '0x0000000000000000000000000000000000000000' as Address // Invalid asset
      const amount = BigInt('1000000000')

      await expect(provider.lend(asset, amount)).rejects.toThrow('Failed to lend')
    })

    it('should use custom slippage when provided', async () => {
      const asset = '0xA0b86a33E6441C8C6bD63aFfaE0E30E2495B5CE0' as Address
      const amount = BigInt('1000000000')
      const marketId = '0x1111111111111111111111111111111111111111111111111111111111111111'
      const customSlippage = 100 // 1%

      const lendTransaction = await provider.lend(asset, amount, marketId, {
        slippage: customSlippage,
      })

      expect(lendTransaction).toHaveProperty('amount', amount)
    })
  })

  describe('findBestMarketForAsset', () => {
    it('should find market with highest APY', async () => {
      const asset = '0xA0b86a33E6441C8C6bD63aFfaE0E30E2495B5CE0' as Address
      
      // Access private method for testing
      const findBestMarket = (provider as any).findBestMarketForAsset.bind(provider)
      
      const marketId = await findBestMarket(asset)
      expect(marketId).toBeTruthy()
      expect(typeof marketId).toBe('string')
    })

    it('should throw error when no markets available for asset', async () => {
      const asset = '0x0000000000000000000000000000000000000000' as Address
      
      const findBestMarket = (provider as any).findBestMarketForAsset.bind(provider)
      
      await expect(findBestMarket(asset)).rejects.toThrow(`No markets available for asset ${asset}`)
    })
  })

  describe('calculateSupplyApy', () => {
    it('should calculate supply APY correctly', () => {
      const mockMarket = {
        borrowRate: BigInt('50000000000000000'), // 5% in wei
        utilization: 0.8, // 80%
      }

      const calculateSupplyApy = (provider as any).calculateSupplyApy.bind(provider)
      const apy = calculateSupplyApy(mockMarket)

      expect(apy).toBe(0.036) // 5% * 0.8 * 0.9 = 3.6%
    })

    it('should handle zero borrow rate', () => {
      const mockMarket = {
        borrowRate: BigInt('0'),
        utilization: 0.8,
      }

      const calculateSupplyApy = (provider as any).calculateSupplyApy.bind(provider)
      const apy = calculateSupplyApy(mockMarket)

      expect(apy).toBe(0)
    })
  })
})