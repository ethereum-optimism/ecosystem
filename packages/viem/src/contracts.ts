import type { Chain } from 'viem'
import { chainConfig } from 'viem/op-stack'

/**
 * OP Stack Predeploy Addresses
 * @category Predeploy Addresses
 */
export const contracts = {
  ...chainConfig.contracts,
  multicall3: {
    address: '0xca11bde05977b3631167028862be2a173976ca11',
  },
  create2Deployer: {
    address: '0x13b0D85CcB8bf860b6b79AF3029fCA081AE9beF2',
  },
  permit2: {
    address: '0x000000000022D473030F116dDEE9F6B43aC78BA3',
  },
  optimismMintableERC20Factory: {
    address: '0x4200000000000000000000000000000000000012',
  },
  weth: {
    address: '0x4200000000000000000000000000000000000006',
  },
} as const satisfies Chain['contracts']

/**
 * Interop Contracts
 *
 * Predeploy addresses from `Predeploys.sol` in
 * `ethereum-optimism/optimism/packages/contracts-bedrock`.
 */
export const interopContracts = {
  l2ToL2CrossDomainMessenger: {
    address: '0x4200000000000000000000000000000000000023',
  },
  crossL2Inbox: {
    address: '0x4200000000000000000000000000000000000022',
  },
  /**
   * @deprecated The `SuperchainTokenBridge` predeploy is not part of OP Stack
   * Upgrade 22 (Lagoon): it was removed from the OP Stack contracts, so chains
   * that activate interop at Lagoon do not have it. It is still available on
   * supersim for local development.
   */
  superchainTokenBridge: {
    address: '0x4200000000000000000000000000000000000028',
  },
  superchainETHBridge: {
    address: '0x4200000000000000000000000000000000000024',
  },
  ethLiquidity: {
    address: '0x4200000000000000000000000000000000000025',
  },
  undeliveredMessageExporter: {
    address: '0x4200000000000000000000000000000000000030',
  },
} as const satisfies Chain['contracts']
