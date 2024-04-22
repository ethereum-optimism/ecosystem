import type {
  Account,
  Address,
  Chain,
  Hash,
  Hex,
  HttpTransport,
  PublicClient,
  PublicRpcSchema,
} from 'viem'
import { createPublicClient, http } from 'viem'
import {
  base,
  baseSepolia,
  fraxtal,
  fraxtalTestnet,
  liskSepolia,
  mainnet,
  mode,
  modeTestnet,
  optimism,
  optimismSepolia,
  sepolia,
  zora,
  zoraSepolia,
} from 'viem/chains'

import { envVars } from './envVars'

type ChainWithRpcUrl = { chain: Chain; rpcUrl: string }

export type SuperchainNetwork = {
  type: NetworkType
  mainnet: ChainWithRpcUrl | null
  testnets: ChainWithRpcUrl[]
}

export type SuperchainBrand =
  | 'ethereum'
  | 'base'
  | 'fraxtal'
  | 'lisk'
  | 'mode'
  | 'op'
  | 'zora'
export type NetworkType = 'l1' | 'l2'

type TraceType =
  | 'CALL'
  | 'DELEGATECALL'
  | 'STATICCALL'
  | 'CREATE'
  | 'CREATE2'
  | 'SELFDESTRUCT'
  | 'REWARD'

type TraceCall = {
  type: TraceType
  from: Address
  to: Address
  gas?: Hex
  gasUsed?: Hex
  input: Hex
  output: Hex
  calls?: TraceCall[]
  value?: Hex
}

type TraceResult = {
  type: TraceType
  from: Address
  to: Address
  value: bigint
  gas: Hex
  gasUsed: Hex
  input: Hex
  output: Hex
  calls?: TraceCall[]
}

type DebugTraceTransactionResult = TraceResult

type DebugTraceTransactionRpcSchema = {
  Method: 'debug_traceTransaction'
  Parameters: DebugTraceTransactionParams
  ReturnType: DebugTraceTransactionResult
}

type DebugTraceTransactionParams = [Hash, { tracer: 'callTracer' }]

export const superchain: Record<SuperchainBrand, SuperchainNetwork> = {
  ethereum: {
    type: 'l1',
    mainnet: { chain: mainnet, rpcUrl: envVars.MAINNET_JSON_RPC_URL },
    testnets: [
      {
        chain: sepolia,
        rpcUrl: envVars.SEPOLIA_JSON_RPC_URL || sepolia.rpcUrls.default.http[0],
      },
    ],
  },
  base: {
    type: 'l2',
    mainnet: { chain: base, rpcUrl: envVars.BASE_JSON_RPC_URL },
    testnets: [
      {
        chain: baseSepolia,
        rpcUrl:
          envVars.BASE_SEPOLIA_JSON_RPC_URL ||
          baseSepolia.rpcUrls.default.http[0],
      },
    ],
  },
  fraxtal: {
    type: 'l2',
    mainnet: { chain: fraxtal, rpcUrl: envVars.FRAX_JSON_RPC_URL },
    testnets: [
      {
        chain: fraxtalTestnet,
        rpcUrl:
          envVars.FRAX_SEPOLIA_JSON_RPC_URL ||
          fraxtalTestnet.rpcUrls.default.http[0],
      },
    ],
  },
  lisk: {
    type: 'l2',
    mainnet: null,
    testnets: [
      {
        chain: liskSepolia,
        rpcUrl:
          envVars.LISK_SEPOLIA_JSON_RPC_URL ||
          liskSepolia.rpcUrls.default.http[0],
      },
    ],
  },
  mode: {
    type: 'l2',
    mainnet: { chain: mode, rpcUrl: envVars.MODE_JSON_RPC_URL },
    testnets: [
      {
        chain: modeTestnet,
        rpcUrl:
          envVars.MODE_SEPOLIA_JSON_RPC_URL ||
          modeTestnet.rpcUrls.default.http[0],
      },
    ],
  },
  op: {
    type: 'l2',
    mainnet: { chain: optimism, rpcUrl: envVars.OP_MAINNET_JSON_RPC_URL },
    testnets: [
      {
        chain: optimismSepolia,
        rpcUrl:
          envVars.OP_SEPOLIA_JSON_RPC_URL ||
          optimismSepolia.rpcUrls.default.http[0],
      },
    ],
  },
  zora: {
    type: 'l2',
    mainnet: { chain: zora, rpcUrl: envVars.ZORA_JSON_RPC_URL },
    testnets: [
      {
        chain: zoraSepolia,
        rpcUrl:
          envVars.ZORA_SEPOLIA_JSON_RPC_URL ||
          zoraSepolia.rpcUrls.default.http[0],
      },
    ],
  },
}

export const SUPPORTED_L2_MAINNET_CHAINS = Object.values(superchain)
  .filter((superchainNetwork) => superchainNetwork.type === 'l2')
  .filter(
    (
      superchainNetwork,
    ): superchainNetwork is Omit<SuperchainNetwork, 'mainnet'> & {
      mainnet: NonNullable<SuperchainNetwork['mainnet']>
    } => !!superchainNetwork.mainnet,
  )
  .map((l2Network) => l2Network.mainnet)

export const SUPPORTED_L2_TESTNET_CHAINS = Object.values(superchain)
  .filter((superchainNetwork) => superchainNetwork.type === 'l2')
  .flatMap((l2Network) => l2Network.testnets)

export const SUPPORTED_L2_CHAINS = [
  ...SUPPORTED_L2_MAINNET_CHAINS,
  ...(envVars.INCLUDE_TESTNETS ? SUPPORTED_L2_TESTNET_CHAINS : []),
]

export const SUPPORTED_L1_MAINNET_CHAINS = Object.values(superchain)
  .filter((superchainNetwork) => superchainNetwork.type === 'l1')
  .filter(
    (
      superchainNetwork,
    ): superchainNetwork is Omit<SuperchainNetwork, 'mainnet'> & {
      mainnet: NonNullable<SuperchainNetwork['mainnet']>
    } => !!superchainNetwork.mainnet,
  )
  .map((l1Network) => l1Network.mainnet)

export const SUPPORTED_L1_TESTNET_CHAINS = Object.values(superchain)
  .filter((superchainNetwork) => superchainNetwork.type === 'l1')
  .flatMap((l2Network) => l2Network.testnets)

export const SUPPORTED_L1_CHAINS = [
  ...SUPPORTED_L1_MAINNET_CHAINS,
  ...(envVars.INCLUDE_TESTNETS ? SUPPORTED_L1_TESTNET_CHAINS : []),
]

export const SUPPORTED_CHAINS = [...SUPPORTED_L1_CHAINS, ...SUPPORTED_L2_CHAINS]

export const supportedChainsPublicClientsMap = SUPPORTED_CHAINS.reduce(
  (accumulator, { chain, rpcUrl }) => {
    accumulator[chain.id] = createPublicClient<
      HttpTransport,
      Chain,
      Account,
      [...PublicRpcSchema, DebugTraceTransactionRpcSchema]
    >({
      chain,
      transport: http(rpcUrl),
    }).extend((client) => ({
      async traceTransaction(transactionHash: Hash) {
        return client.request({
          method: 'debug_traceTransaction',
          params: [
            transactionHash,
            {
              tracer: 'callTracer',
            },
          ],
        })
      },
    }))
    return accumulator
  },
  {} as Record<
    number,
    | (PublicClient<
        HttpTransport,
        Chain,
        Account,
        [...PublicRpcSchema, DebugTraceTransactionRpcSchema]
      > & { traceTransaction: (transactionHash: Hash) => Promise<TraceResult> })
    | undefined
  >,
)
