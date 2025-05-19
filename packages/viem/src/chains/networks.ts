import { interopAlphaNetwork } from '@/chains/interopAlpha.js'
import { interopRcAlphaNetwork } from '@/chains/interopRcAlpha.js'
import { mainnetNetwork } from '@/chains/mainnet.js'
import { sepoliaNetwork } from '@/chains/sepolia.js'
import { supersimNetwork } from '@/chains/supersim.js'
import type { Network, NetworkName } from '@/chains/types.js'

/**
 * Map of all unique networks configurations
 * @dev Multiple networks can share the same source chain.
 * @dev Chains can be apart of multiple networks.
 */
export const networks: Record<NetworkName, Network> = {
  mainnet: mainnetNetwork,
  sepolia: sepoliaNetwork,
  supersim: supersimNetwork,
  'interop-alpha': interopAlphaNetwork,
  'interop-rc-alpha': interopRcAlphaNetwork,
}
