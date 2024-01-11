import type { Address } from 'viem'
import type { Chain } from 'viem/chains'
import type { Config } from 'wagmi'

export type NetworkPairItem = {
  chain: Chain
}

export type NetworkPair = {
  l1: Chain
  l2: Chain
}

export type NetworkPairGroup = Record<
  NetworkType,
  Record<string, [Chain, Chain]>
>

export type NetworkDirection = 'l1' | 'l2'

export type DeploymentAddresses = {
  AddressManager: Address
  L1CrossDomainMessengerProxy: Address
  L1ERC721BridgeProxy: Address
  L1StandardBridgeProxy: Address
  L2OutputOracleProxy: Address
  OptimismMintableERC20FactoryProxy: Address
  OptimismPortalProxy: Address
  ProxyAdmin: Address
  SystemConfigProxy?: Address // Only OP mainnet & testnets include this
}

export type OPNetworkContextValue = {
  currentNetwork?: Chain
  currentNetworkPair?: NetworkPair
  isCurrentNetworkUnsupported?: boolean | undefined
  supportedChains?: Record<string, Chain>
}

export type Token = {
  chainId: number
  address: Address
  name: string
  symbol: string
  decimals: number
  logoURI: string
  extensions: {
    optimismBridgeAddress: Address
    opListId: string
    opTokenId: string
  }
}

// Taken from op-wagmi, these types are not being imported from the package yet just added them here to make life easier
// https://github.com/base-org/op-wagmi/blob/9a2302b7cfce902207e3faac173e6ca001503589/src/types/OpConfig.ts
export type ContractAddress<chainId = number> = {
  address: Address
  chainId: chainId
  blockCreated?: number
}
export type L1Addresses<chainId = number> = {
  portal: ContractAddress<chainId>
  l2OutputOracle: ContractAddress<chainId>
  l1StandardBridge: ContractAddress<chainId>
  l1CrossDomainMessenger: ContractAddress<chainId>
  l1Erc721Bridge: ContractAddress<chainId>
}

export type L2Addresses<chainId = number> = {
  l2L1MessagePasserAddress: ContractAddress<chainId>
  l2StandardBridge: ContractAddress<chainId>
}

export type L2Chain<l1ChainId extends number, l2ChainId extends number> = {
  chainId: l2ChainId
  l1ChainId: l1ChainId
  l1Addresses: L1Addresses<l1ChainId>
  l2Addresses: L2Addresses<l2ChainId>
}

export type OpConfig = Config & {
  readonly l2chains: Record<number, L2Chain<number, number>>
}
