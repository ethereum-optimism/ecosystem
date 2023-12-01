import type { Chain } from 'viem/chains'
//import type { WalletClient, PublicClient } from 'viem'

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
    AddressManager: string
    L1CrossDomainMessengerProxy: string
    L1ERC721BridgeProxy: string
    L1StandardBridgeProxy: string
    L2OutputOracleProxy: string
    OptimismMintableERC20FactoryProxy: string
    OptimismPortalProxy: string
    ProxyAdmin: string
    SystemConfigProxy?: string // Only OP mainnet & testnets include this
}

export type OPNetworkContextValue = {
    currentNetwork?: Chain
    currentNetworkPair?: NetworkPair
    isCurrentNetworkUnsupported?: boolean | undefined
    supportedChains?: Record<string, Chain>
}
