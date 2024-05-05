import type { Chain } from 'viem'

import type {
  MainnetPaymasterProviderConfig,
  TestnetPaymasterProviderConfig,
} from '@/config/PaymasterProviderConfig'

export type ChainConfig = TestnetChainConfig | MainnetChainConfig

export type TestnetChainConfig = {
  chain: Chain
  paymasterProviderConfig: TestnetPaymasterProviderConfig
}

export type MainnetChainConfig = {
  chain: Chain
  paymasterProviderConfig: MainnetPaymasterProviderConfig
}
