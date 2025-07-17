import type { Address } from 'viem'

/**
 * Lending provider interface
 * @description Interface for lending provider implementations
 */
export interface LendProvider {
  /**
   * Lend/supply assets to a market
   * @param asset - Asset token address to lend
   * @param amount - Amount to lend (in wei)
   * @param marketId - Optional specific market ID
   * @returns Promise resolving to lending transaction details
   */
  lend(asset: Address, amount: bigint, marketId?: string): Promise<LendTransaction>

  /**
   * Get available markets for lending
   * @returns Promise resolving to array of available markets
   */
  getAvailableMarkets(): Promise<LendMarket[]>

  /**
   * Get detailed market information
   * @param marketId - Market identifier
   * @returns Promise resolving to market information
   */
  getMarketInfo(marketId: string): Promise<LendMarketInfo>
}

/**
 * Lending transaction result
 * @description Result of a lending operation
 */
export interface LendTransaction {
  /** Transaction hash */
  hash: string
  /** Amount lent */
  amount: bigint
  /** Asset address */
  asset: Address
  /** Market ID */
  marketId: string
  /** Estimated APY at time of lending */
  apy: number
  /** Transaction timestamp */
  timestamp: number
}

/**
 * Lending market information
 * @description Basic information about a lending market
 */
export interface LendMarket {
  /** Market identifier */
  id: string
  /** Market name */
  name: string
  /** Loanable asset address */
  loanToken: Address
  /** Collateral asset address */
  collateralToken: Address
  /** Current supply APY */
  supplyApy: number
  /** Current utilization rate */
  utilization: number
  /** Available liquidity */
  liquidity: bigint
}

/**
 * Detailed lending market information
 * @description Comprehensive market data including rates and parameters
 */
export interface LendMarketInfo extends LendMarket {
  /** Oracle address */
  oracle: Address
  /** Interest rate model address */
  irm: Address
  /** Loan-to-value ratio */
  lltv: number
  /** Total supply */
  totalSupply: bigint
  /** Total borrow */
  totalBorrow: bigint
  /** Supply rate */
  supplyRate: bigint
  /** Borrow rate */
  borrowRate: bigint
  /** Last update timestamp */
  lastUpdate: number
}

/**
 * Lending options
 * @description Configuration options for lending operations
 */
export interface LendOptions {
  /** Maximum slippage tolerance (basis points) */
  slippage?: number
  /** Deadline for transaction (timestamp) */
  deadline?: number
  /** Gas limit override */
  gasLimit?: bigint
  /** Gas price override */
  gasPrice?: bigint
}

/**
 * Lending provider configuration
 * @description Configuration for lending providers
 */
export type LendConfig = MorphoLendConfig

/**
 * Morpho lending provider configuration
 * @description Configuration specific to Morpho lending provider
 */
export interface MorphoLendConfig {
  /** Lending provider type */
  type: 'morpho'
  /** Morpho protocol address */
  morphoAddress: Address
  /** Bundler address for transaction bundling */
  bundlerAddress: Address
  /** Default slippage tolerance (basis points) */
  defaultSlippage?: number
}
