// DO NOT MODIFY THIS FILE IS AUTOGENERATED
import type { Chain } from 'viem/chains'
import {
  base,
  baseGoerli,
  baseSepolia,
  goerli,
  mainnet,
  optimism,
  optimismGoerli,
  optimismSepolia,
  pgn,
  pgnTestnet,
  sepolia,
  zora,
  zoraSepolia,
} from 'viem/chains'

import type { NetworkPairGroup } from '../types'
import { lyra, mode, orderlyNetwork } from './chains'

export type NetworkType =
  | 'base'
  | 'op'
  | 'lyra'
  | 'mode'
  | 'orderly'
  | 'pgn'
  | 'zora'

export const networkPairsByGroup: NetworkPairGroup = {
  base: {
    goerli: [goerli, baseGoerli],
    mainnet: [mainnet, base],
    sepolia: [sepolia, baseSepolia],
  },
  op: {
    goerli: [goerli, optimismGoerli],
    mainnet: [mainnet, optimism],
    sepolia: [sepolia, optimismSepolia],
  },
  lyra: {
    mainnet: [mainnet, lyra],
  },
  mode: {
    mainnet: [mainnet, mode],
  },
  orderly: {
    mainnet: [mainnet, orderlyNetwork],
  },
  pgn: {
    mainnet: [mainnet, pgn],
    sepolia: [sepolia, pgnTestnet],
  },
  zora: {
    mainnet: [mainnet, zora],
    sepolia: [sepolia, zoraSepolia],
  },
}

export const networkPairsByID: Record<number, [Chain, Chain]> = {
  84531: [goerli, baseGoerli],
  420: [goerli, optimismGoerli],
  8453: [mainnet, base],
  957: [mainnet, lyra],
  34443: [mainnet, mode],
  10: [mainnet, optimism],
  291: [mainnet, orderlyNetwork],
  424: [mainnet, pgn],
  7777777: [mainnet, zora],
  84532: [sepolia, baseSepolia],
  11155420: [sepolia, optimismSepolia],
  58008: [sepolia, pgnTestnet],
  999999999: [sepolia, zoraSepolia],
}
