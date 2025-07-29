import { contracts } from '@eth-optimism/viem'
import { l2ToL2CrossDomainMessengerAbi } from '@eth-optimism/viem/abis'
import type { Network } from '@eth-optimism/viem/chains'
import { getPublicClient } from '@wagmi/core'
import { useEffect, useState } from 'react'
import type { Chain } from 'viem'
import { useConfig } from 'wagmi'

const interopEnabledNetworks = ['supersim', 'interop-alpha', 'interop-rc-alpha']

/**
 * Returns the chains that are enabled for interop. This doesn't take
 * into account the dependency and simply filters the chains with the
 * L2ToL2CrossDomainMessenger predeploy present.
 * @param network - The network to check
 * @returns The chains that are enabled for interop
 */
export const useInteropEnabledChains = (network: Network) => {
  const config = useConfig()

  const [retVal, setRetVal] = useState({
    enabledChains: [] as Chain[],
    isLoading: true,
  })

  const chains = network.chains
  const address = contracts.l2ToL2CrossDomainMessenger.address
  useEffect(() => {
    const checkChains = async () => {
      // Skip if interop enabled by default
      if (interopEnabledNetworks.includes(network.name)) {
        setRetVal({ enabledChains: chains, isLoading: false })
        return
      }

      // Filter out chains that don't have the L2ToL2CrossDomainMessenger predeploy
      const results = await Promise.allSettled(
        chains.map(async (chain) => {
          const client = getPublicClient(config, { chainId: chain.id })
          const version = await client!.readContract({
            address,
            abi: l2ToL2CrossDomainMessengerAbi,
            functionName: 'version',
          })

          return !!version && version.length > 0 ? chain : undefined
        }),
      )

      const enabledChains = results
        .filter((result) => result.status === 'fulfilled' && result.value)
        .map((result) => (result as PromiseFulfilledResult<Chain>).value)

      setRetVal({ enabledChains, isLoading: false })
    }

    checkChains()
  }, [network, config, address, chains])

  return retVal
}
