import {
  base,
  baseSepolia,
  fraxtal,
  mainnet,
  optimism,
  optimismSepolia,
  sepolia,
  zora,
  zoraSepolia,
} from 'viem/chains'

import { mode } from '@/constants/mode'
import type { Env } from '@/env'

// // Testnet chains for dev
// export const supportedL1Chains = [sepolia] as const

// export const supportedL2Chains = [
//   optimismSepolia,
//   baseSepolia,
//   zoraSepolia,
// ] as const

// Mainnet chains for prod
export const supportedL1Chains = [mainnet] as const

export const supportedL2Chains = [base, fraxtal, mode, optimism, zora] as const

export const supportedChains = [
  ...supportedL1Chains,
  ...supportedL2Chains,
] as const

export const getChainConfigForId = (env: Env, chainId: SupportedChainId) => {
  const chainConfigById = {
    [sepolia.id]: { rpcUrl: env.SEPOLIA_JSON_RPC_URL },
    [optimismSepolia.id]: {
      rpcUrl: env.OP_SEPOLIA_JSON_RPC_URL,
      emoji: '🔴',
      splashImageSrc:
        'https://imagedelivery.net/2vgv0PX0bK5wmgjKfeGfRQ/cf6758b0-edf6-4ee2-5aa6-d65cdbfa2f00/framesquare',
    },
    [zoraSepolia.id]: {
      rpcUrl: env.ZORA_SEPOLIA_JSON_RPC_URL,
      emoji: '🟣',
      splashImageSrc:
        'https://imagedelivery.net/2vgv0PX0bK5wmgjKfeGfRQ/2ce2952f-6ac0-4d8d-b366-e46dd4b06600/framesquare',
    },
    [baseSepolia.id]: {
      rpcUrl: env.BASE_SEPOLIA_JSON_RPC_URL,
      emoji: '🔵',
      splashImageSrc:
        'https://imagedelivery.net/2vgv0PX0bK5wmgjKfeGfRQ/875a32fc-581c-4bb2-03c6-6e7ddf550c00/framesquare',
    },

    [mainnet.id]: { rpcUrl: env.MAINNET_JSON_RPC_URL },
    [optimism.id]: {
      rpcUrl: env.OP_MAINNET_JSON_RPC_URL,
      emoji: '🔴',
      splashImageSrc:
        'https://imagedelivery.net/2vgv0PX0bK5wmgjKfeGfRQ/cf6758b0-edf6-4ee2-5aa6-d65cdbfa2f00/framesquare',
    },
    [zora.id]: {
      rpcUrl: env.ZORA_JSON_RPC_URL,
      emoji: '🟣',
      splashImageSrc:
        'https://imagedelivery.net/2vgv0PX0bK5wmgjKfeGfRQ/2ce2952f-6ac0-4d8d-b366-e46dd4b06600/framesquare',
    },
    [base.id]: {
      rpcUrl: env.BASE_JSON_RPC_URL,
      emoji: '🔵',
      splashImageSrc:
        'https://imagedelivery.net/2vgv0PX0bK5wmgjKfeGfRQ/875a32fc-581c-4bb2-03c6-6e7ddf550c00/framesquare',
    },
    [mode.id]: {
      rpcUrl: env.MODE_JSON_RPC_URL,
      emoji: '🟡',
      splashImageSrc:
        'https://imagedelivery.net/2vgv0PX0bK5wmgjKfeGfRQ/c38d58da-224f-4480-2084-cda20b776900/framesquare',
    },
    [fraxtal.id]: {
      rpcUrl: env.FRAXTAL_JSON_RPC_URL,
      emoji: '⚫',
      splashImageSrc:
        'https://imagedelivery.net/2vgv0PX0bK5wmgjKfeGfRQ/59e1602a-7bf3-4dac-ecfd-bfac5ac96200/framesquare',
    },
  } as const satisfies Record<
    number,
    {
      rpcUrl: string
      emoji?: string
      splashImageSrc?: string
    }
  >

  return chainConfigById[chainId] as {
    rpcUrl: string
    emoji?: string
    splashImageSrc?: string
  }
}

export type SupportedL2Chains = typeof supportedL2Chains
export type SupportedL2ChainId = SupportedL2Chains[number]['id']

export type SupportedL1Chains = typeof supportedL1Chains
export type SupportedL1ChainId = SupportedL1Chains[number]['id']

export type SupportedChains = typeof supportedChains
export type SupportedChainId = SupportedL1ChainId | SupportedL2ChainId
