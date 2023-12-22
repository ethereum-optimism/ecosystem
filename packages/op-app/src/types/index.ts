import type { Address } from 'viem'
import type { Chain } from 'viem/chains'

export type NetworkPairItem = {
  chain: Chain
}

export type NetworkPair = {
  l1: Chain
  l2: Chain
}

export type NetworkType = 'base' | 'op' | 'pgn' | 'zora'

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
