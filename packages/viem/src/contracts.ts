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
  crossL2Inbox: {
    address: '0x4200000000000000000000000000000000000022',
  },
  l2ToL2CrossDomainMessenger: {
    address: '0x4200000000000000000000000000000000000023',
  },
  optimismMintableERC20Factory: {
    address: '0x4200000000000000000000000000000000000012',
  },
  superchainTokenBridge: {
    address: '0x4200000000000000000000000000000000000028',
  },
  superchainETHBridge: {
    address: '0x4200000000000000000000000000000000000024',
  },
  weth: {
    address: '0x4200000000000000000000000000000000000006',
  },
} as const satisfies Chain['contracts']
