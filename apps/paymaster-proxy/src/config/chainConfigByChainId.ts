import {
  base,
  baseSepolia,
  fraxtal,
  optimism,
  optimismSepolia,
  sepolia,
  zora,
  zoraSepolia,
} from 'viem/chains'

import type {
  MainnetChainConfig,
  TestnetChainConfig,
} from '@/config/ChainConfig'
import { fraxtalSepolia } from '@/constants/fraxtalSepolia'
import { envVars } from '@/envVars'

export const testnetChainConfigByChainId = {
  [sepolia.id]: {
    chain: sepolia,
    paymasterProviderConfig: {
      type: 'alchemy',
      gasManagerAccessKey: envVars.ALCHEMY_GAS_MANAGER_ACCESS_KEY,
      appId: envVars.ALCHEMY_APP_ID_SEPOLIA,
      rpcUrl: envVars.ALCHEMY_RPC_URL_SEPOLIA,
      sharedPolicyId: envVars.ALCHEMY_GAS_MANAGER_POLICY_ID_SEPOLIA,
    },
  },
  [optimismSepolia.id]: {
    chain: optimismSepolia,
    paymasterProviderConfig: {
      type: 'alchemy',
      gasManagerAccessKey: envVars.ALCHEMY_GAS_MANAGER_ACCESS_KEY,
      appId: envVars.ALCHEMY_APP_ID_OP_SEPOLIA,
      rpcUrl: envVars.ALCHEMY_RPC_URL_OP_SEPOLIA,
      sharedPolicyId: envVars.ALCHEMY_GAS_MANAGER_POLICY_ID_OP_SEPOLIA,
    },
  },
  [zoraSepolia.id]: {
    chain: zoraSepolia,
    paymasterProviderConfig: {
      type: 'alchemy',
      gasManagerAccessKey: envVars.ALCHEMY_GAS_MANAGER_ACCESS_KEY,
      appId: envVars.ALCHEMY_APP_ID_ZORA_SEPOLIA,
      rpcUrl: envVars.ALCHEMY_RPC_URL_ZORA_SEPOLIA,
      sharedPolicyId: envVars.ALCHEMY_GAS_MANAGER_POLICY_ID_ZORA_SEPOLIA,
    },
  },
  [baseSepolia.id]: {
    chain: baseSepolia,
    paymasterProviderConfig: {
      type: 'alchemy',
      gasManagerAccessKey: envVars.ALCHEMY_GAS_MANAGER_ACCESS_KEY,
      appId: envVars.ALCHEMY_APP_ID_BASE_SEPOLIA,
      rpcUrl: envVars.ALCHEMY_RPC_URL_BASE_SEPOLIA,
      sharedPolicyId: envVars.ALCHEMY_GAS_MANAGER_POLICY_ID_BASE_SEPOLIA,
    },
  },
  [fraxtalSepolia.id]: {
    chain: fraxtalSepolia,
    paymasterProviderConfig: {
      type: 'alchemy',
      gasManagerAccessKey: envVars.ALCHEMY_GAS_MANAGER_ACCESS_KEY,
      appId: envVars.ALCHEMY_APP_ID_FRAXTAL_SEPOLIA,
      rpcUrl: envVars.ALCHEMY_RPC_URL_FRAXTAL_SEPOLIA,
      sharedPolicyId: envVars.ALCHEMY_GAS_MANAGER_POLICY_ID_FRAXTAL_SEPOLIA,
    },
  },
} as const satisfies Record<number, TestnetChainConfig>

export const mainnetChainConfigByChainId = {
  [optimism.id]: {
    chain: optimism,
    paymasterProviderConfig: {
      type: 'alchemy',
      gasManagerAccessKey: envVars.ALCHEMY_GAS_MANAGER_ACCESS_KEY,
      appId: envVars.ALCHEMY_APP_ID_OP_MAINNET,
      rpcUrl: envVars.ALCHEMY_RPC_URL_OP_MAINNET,
    },
  },
  [base.id]: {
    chain: base,
    paymasterProviderConfig: {
      type: 'alchemy',
      gasManagerAccessKey: envVars.ALCHEMY_GAS_MANAGER_ACCESS_KEY,
      appId: envVars.ALCHEMY_APP_ID_BASE,
      rpcUrl: envVars.ALCHEMY_RPC_URL_BASE,
    },
  },
  [fraxtal.id]: {
    chain: fraxtal,
    paymasterProviderConfig: {
      type: 'alchemy',
      gasManagerAccessKey: envVars.ALCHEMY_GAS_MANAGER_ACCESS_KEY,
      appId: envVars.ALCHEMY_APP_ID_FRAXTAL,
      rpcUrl: envVars.ALCHEMY_RPC_URL_FRAXTAL,
    },
  },
  [zora.id]: {
    chain: zora,
    paymasterProviderConfig: {
      type: 'alchemy',
      gasManagerAccessKey: envVars.ALCHEMY_GAS_MANAGER_ACCESS_KEY,
      appId: envVars.ALCHEMY_APP_ID_ZORA,
      rpcUrl: envVars.ALCHEMY_RPC_URL_ZORA,
    },
  },
} as const satisfies Record<number, MainnetChainConfig>

export type SupportedTestnetChainId = keyof typeof testnetChainConfigByChainId

export const chainConfigByChainId = {
  ...testnetChainConfigByChainId,
  ...mainnetChainConfigByChainId,
} as const

export type SupportedChainId = keyof typeof chainConfigByChainId
