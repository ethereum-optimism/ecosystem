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
      })
    },
  )
