import type { Address, Hex } from 'viem'

import { ONCE_UPON_BASE_URL, supportedFaucetConfigs } from '../constants'
import { envVars } from '../constants/envVars'
import { Faucet } from '../utils'
import type { RedisCache } from './redis'

export const getSupportedFaucets = (redisCache: RedisCache) =>
  supportedFaucetConfigs.map(
    ({
      chain,
      displayName,
      onChainDripAmount,
      offChainDripAmount,
      onChainModuleAddress,
      offChainModuleAddress,
    }) => {
      return new Faucet({
        chainId: chain.id,
        redisCache: redisCache,
        faucetAddress: envVars.FAUCET_V1_CONTRACT_ADDRESS as Address,
        displayName,
        onChainDripAmount,
        offChainDripAmount,
        blockExplorerUrl: ONCE_UPON_BASE_URL,
        onChainAuthModuleAddress: onChainModuleAddress,
        offChainAuthModuleAddress: offChainModuleAddress,
      })
    },
  )
