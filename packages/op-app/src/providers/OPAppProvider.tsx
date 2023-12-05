import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useMemo } from 'react'
import type { Transport } from 'viem'
import type { Chain } from 'viem/chains'
import type { Config, CreateConfigParameters, CreateConnectorFn } from 'wagmi'
import { createConfig, http, WagmiProvider } from 'wagmi'

import { networkPairsByGroup } from '../configs/networkPairs'
import type { NetworkType } from '../types'

export type OPAppProviderProps = {
  wagmiConfig?: CreateConfigParameters
  connectors?: CreateConnectorFn[]
  defaultChainId?: number
  children: React.ReactNode
}

type CreateWagmiConfig = {
  defaultChainId?: number
  connectors?: CreateConnectorFn[]
}

const queryClient = new QueryClient()

const createWagmiConfigFromType = ({
  connectors,
  defaultChainId,
}: CreateWagmiConfig): Config => {
  let supportedChains = [] as Chain[]

  const networkTypes = Object.keys(networkPairsByGroup) as NetworkType[]
  for (const type of networkTypes) {
    const networks = Object.values(networkPairsByGroup[type]).flat()
    supportedChains = supportedChains.concat(networks)
  }

  const defaultChain = (
    defaultChainId
      ? supportedChains.find((chain) => chain.id === defaultChainId)
      : supportedChains[0]
  ) as Chain
  const allOtherChains = defaultChain
    ? supportedChains.filter((chain) => chain.id !== defaultChainId)
    : supportedChains.slice(1)

  return createConfig({
    chains: [defaultChain, ...allOtherChains],
    connectors: connectors,
    transports: supportedChains.reduce(
      (acc, chain) => {
        acc[chain.id] = http()
        return acc
      },
      {} as Record<number, Transport>,
    ),
  })
}

export const OPAppProvider = ({
  children,
  connectors,
  defaultChainId,
  wagmiConfig,
}: OPAppProviderProps) => {
  const config = useMemo<Config>(() => {
    return wagmiConfig
      ? createConfig(wagmiConfig)
      : createWagmiConfigFromType({ connectors, defaultChainId })
  }, [connectors, defaultChainId, wagmiConfig])

  return (
    <WagmiProvider reconnectOnMount config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
