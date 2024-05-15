import { baseSepolia, optimismSepolia, sepolia, zoraSepolia } from 'viem/chains'

import type { TestnetChainConfig } from '@/config/ChainConfig'
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

export type SupportedTestnetChainId = keyof typeof testnetChainConfigByChainId

export const chainConfigByChainId = { ...testnetChainConfigByChainId } as const

export type SupportedChainId = keyof typeof chainConfigByChainId
