import type { Address, PublicClient } from 'viem'
import { Market, type MarketConfig } from '@morpho-org/blue-sdk'
import { MarketConfig as MarketConfigViem } from '@morpho-org/blue-sdk-viem'
import { type InputBundlerOperation, populateBundle, finalizeBundle, encodeBundle } from '@morpho-org/bundler-sdk-viem'

import type {
  LendMarket,
  LendMarketInfo,
  LendOptions,
  LendProvider,
  LendTransaction,
  MorphoLendConfig,
} from '../types/lending.js'

/**
 * Morpho lending provider implementation
 * @description Lending provider implementation using Morpho protocol
 */
export class MorphoLendProvider implements LendProvider {
  private morphoAddress: Address
  private bundlerAddress: Address
  private defaultSlippage: number
  private chainId: number
  private publicClient: PublicClient

  /**
   * Create a new Morpho lending provider
   * @param config - Morpho lending configuration
   * @param chainId - Chain ID for the provider
   * @param publicClient - Viem public client for blockchain interactions
   */
  constructor(config: MorphoLendConfig, chainId: number, publicClient: PublicClient) {
    this.morphoAddress = config.morphoAddress
    this.bundlerAddress = config.bundlerAddress
    this.defaultSlippage = config.defaultSlippage || 50 // 0.5% default
    this.chainId = chainId
    this.publicClient = publicClient
  }

  /**
   * Lend assets to a Morpho market
   * @description Supplies assets to a Morpho market using Blue_Supply operation
   * @param asset - Asset token address to lend
   * @param amount - Amount to lend (in wei)
   * @param marketId - Optional specific market ID
   * @param options - Optional lending configuration
   * @returns Promise resolving to lending transaction details
   */
  async lend(
    asset: Address,
    amount: bigint,
    marketId?: string,
    options?: LendOptions,
  ): Promise<LendTransaction> {
    try {
      // 1. Find suitable market if marketId not provided
      const selectedMarketId = marketId || await this.findBestMarketForAsset(asset)
      
      // 2. Get market information for APY calculation
      const marketInfo = await this.getMarketInfo(selectedMarketId)
      
      // 3. Create Blue_Supply operation
      const supplyOperation: InputBundlerOperation = {
        type: 'Blue_Supply',
        sender: '0x' + '0'.repeat(40) as Address, // Will be set by wallet
        address: this.morphoAddress,
        args: {
          id: selectedMarketId,
          assets: amount,
          onBehalf: '0x' + '0'.repeat(40) as Address, // Will be set by wallet
          slippage: options?.slippage || this.defaultSlippage,
        },
      }

      // 4. Bundle and prepare transaction
      const operations = [supplyOperation]
      const bundle = await populateBundle(operations, this.publicClient)
      const finalBundle = await finalizeBundle(bundle, this.publicClient)
      const encodedBundle = encodeBundle(finalBundle)

      // 5. Return transaction details (actual execution will be handled by wallet)
      const currentTimestamp = Math.floor(Date.now() / 1000)
      
      return {
        hash: '0x' + '0'.repeat(64), // Placeholder - actual hash from wallet execution
        amount,
        asset,
        marketId: selectedMarketId,
        apy: marketInfo.supplyApy,
        timestamp: currentTimestamp,
      }
    } catch (error) {
      throw new Error(
        `Failed to lend ${amount} of ${asset}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }

  /**
   * Find the best market for a given asset
   * @param asset - Asset token address
   * @returns Promise resolving to market ID
   */
  private async findBestMarketForAsset(asset: Address): Promise<string> {
    const markets = await this.getAvailableMarkets()
    const assetMarkets = markets.filter(market => market.loanToken === asset)
    
    if (assetMarkets.length === 0) {
      throw new Error(`No markets available for asset ${asset}`)
    }

    // Return market with highest APY
    return assetMarkets.reduce((best, current) => 
      current.supplyApy > best.supplyApy ? current : best
    ).id
  }

  /**
   * Get available markets for lending
   * @description Retrieves all available Morpho markets for lending
   * @returns Promise resolving to array of available markets
   */
  async getAvailableMarkets(): Promise<LendMarket[]> {
    try {
      // 1. Fetch market configurations from Morpho
      const marketConfigs = await this.fetchMarketConfigs()
      
      // 2. Process each market to get current data
      const markets: LendMarket[] = []
      
      for (const config of marketConfigs) {
        try {
          const market = await Market.fetch(config.id, this.publicClient)
          const accruedMarket = market.accrueInterest(Date.now())
          
          // Calculate APY and utilization
          const utilization = accruedMarket.utilization
          const supplyApy = this.calculateSupplyApy(accruedMarket)
          const liquidity = accruedMarket.liquidity
          
          markets.push({
            id: config.id,
            name: `${config.loanToken.symbol}/${config.collateralToken.symbol} Market`,
            loanToken: config.loanToken.address,
            collateralToken: config.collateralToken.address,
            supplyApy,
            utilization,
            liquidity,
          })
        } catch (marketError) {
          // Skip markets that fail to fetch
          console.warn(`Failed to fetch market ${config.id}:`, marketError)
        }
      }
      
      return markets
    } catch (error) {
      throw new Error(`Failed to fetch available markets: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Fetch market configurations from Morpho
   * @returns Promise resolving to array of market configurations
   */
  private async fetchMarketConfigs(): Promise<MarketConfig[]> {
    // TODO: Implement actual market config fetching
    // This would typically fetch from Morpho's subgraph or registry
    
    // Placeholder implementation with common markets
    return [
      {
        id: '0x' + '1'.repeat(64),
        loanToken: {
          address: '0xA0b86a33E6441C8C6bD63aFfaE0E30E2495B5CE0' as Address,
          symbol: 'USDC',
          decimals: 6,
        },
        collateralToken: {
          address: '0x4200000000000000000000000000000000000006' as Address,
          symbol: 'WETH',
          decimals: 18,
        },
        oracle: '0x' + '2'.repeat(40) as Address,
        irm: '0x' + '3'.repeat(40) as Address,
        lltv: 0.8,
      },
    ] as MarketConfig[]
  }

  /**
   * Calculate supply APY for a market
   * @param market - Accrued market instance
   * @returns Supply APY as decimal (0.05 = 5%)
   */
  private calculateSupplyApy(market: Market): number {
    // TODO: Implement actual APY calculation using market rates
    // This is a simplified calculation
    const borrowRate = Number(market.borrowRate || 0n) / 1e18
    const utilization = market.utilization
    return borrowRate * utilization * 0.9 // 90% of borrow rate goes to suppliers
  }

  /**
   * Get detailed market information
   * @description Retrieves comprehensive information about a specific market
   * @param marketId - Market identifier
   * @returns Promise resolving to detailed market information
   */
  async getMarketInfo(marketId: string): Promise<LendMarketInfo> {
    try {
      // 1. Fetch market configuration
      const config = await MarketConfigViem.fetch(marketId, this.publicClient)
      
      // 2. Fetch current market state
      const market = await Market.fetch(marketId, this.publicClient)
      const accruedMarket = market.accrueInterest(Date.now())
      
      // 3. Calculate rates and utilization
      const utilization = accruedMarket.utilization
      const supplyApy = this.calculateSupplyApy(accruedMarket)
      const liquidity = accruedMarket.liquidity
      
      return {
        id: marketId,
        name: `${config.loanToken.symbol}/${config.collateralToken.symbol} Market`,
        loanToken: config.loanToken.address,
        collateralToken: config.collateralToken.address,
        supplyApy,
        utilization,
        liquidity,
        oracle: config.oracle,
        irm: config.irm,
        lltv: config.lltv,
        totalSupply: accruedMarket.totalSupply,
        totalBorrow: accruedMarket.totalBorrow,
        supplyRate: accruedMarket.supplyRate,
        borrowRate: accruedMarket.borrowRate,
        lastUpdate: Math.floor(Date.now() / 1000),
      }
    } catch (error) {
      throw new Error(`Failed to get market info for ${marketId}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}