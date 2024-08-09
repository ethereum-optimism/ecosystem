import { sepolia } from 'viem/chains'

import type { TransactionSender } from '@/transaction-sender/TransactionSender'

import {
  adminWalletAccount,
  ONCE_UPON_BASE_URL,
  sepoliaPublicClient,
  supportedFaucetConfigs,
} from '../constants'
import { envVars } from '../constants/envVars'
import { Faucet } from '../utils'
import type { RedisCache } from './redis'

export const getSupportedFaucets = (
  redisCache: RedisCache,
  transactionSender: TransactionSender,
) =>
  supportedFaucetConfigs.map(
    ({
      chain,
      displayName,
      onChainDripAmount,
      offChainDripAmount,
      l1BridgeAddress,
      isL1Faucet,
    }) => {
      return new Faucet({
        chainId: chain.id,
        redisCache: redisCache,
        faucetAddress: envVars.FAUCET_CONTRACT_ADDRESS,
        displayName,
        onChainDripAmount,
        offChainDripAmount,
        blockExplorerUrl: ONCE_UPON_BASE_URL,
        onChainAuthModuleAddress: envVars.FAUCET_ON_CHAIN_MODULE_ADDRESS,
        offChainAuthModuleAddress: envVars.FAUCET_OFF_CHAIN_MODULE_ADDRESS,
        l1BridgeAddress,
        isL1Faucet,
        publicClient: sepoliaPublicClient,
        adminAccount: adminWalletAccount,
        transactionSender,
        l1ChainId: sepolia.id,
      })
    },
  )
