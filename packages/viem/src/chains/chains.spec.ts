import { describe, expect, it } from 'vitest'

import { mainnetChains } from '@/chains/mainnet.js'
import { sepoliaChains } from '@/chains/sepolia.js'

describe('generated chain definitions', () => {
  // viem's `getGames`, and the withdrawal actions built on it, use a chain
  // definition's `disputeGameFactory` before the portal. OP Mainnet and
  // Unichain move to a shared factory before OP Stack Upgrade 22 (Lagoon), so a
  // stored address would go stale. Without one, viem reads
  // `OptimismPortal2.disputeGameFactory()`.
  it.each([...mainnetChains, ...sepoliaChains].map((c) => [c.name, c]))(
    '%s does not hardcode the dispute game factory',
    (_, chain) => {
      expect(chain.contracts).not.toHaveProperty('disputeGameFactory')
    },
  )

  it.each(['op', 'unichain', 'opSepolia', 'unichainSepolia'])(
    '%s has a portal to read the factory from',
    async (name) => {
      const chains = (await import('@/chains/index.js')) as unknown as Record<
        string,
        { sourceId: number; contracts: Record<string, unknown> }
      >
      const chain = chains[name]
      expect(chain.contracts.portal).toHaveProperty([String(chain.sourceId)])
    },
  )
})
