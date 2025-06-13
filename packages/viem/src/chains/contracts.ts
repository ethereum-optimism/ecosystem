import { mainnet } from 'viem/chains'

import { mainnetContracts } from '@/chains/mainnetContracts.js'

/**
 * Chain Contract defintions. Keyed by the source chain
 * followed by the L2 chain id.
 */
export const contracts = {
  [mainnet.id]: { ...mainnetContracts },
}
