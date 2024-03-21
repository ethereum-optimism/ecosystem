import './App.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useCallback, useMemo, useState } from 'react'
import type { Chain, Transport } from 'viem'
import { http } from 'viem'
import type { Config } from 'wagmi'
import { createConfig, WagmiProvider } from 'wagmi'
import { walletConnect } from 'wagmi/connectors'

import type { NetworkType } from '..'
import { configureOpChains } from '../utils'
import { Demo } from './Demo'

const connectors = [
  walletConnect({ projectId: 'e9c485da698064d6df5c19c5d12a845c' }),
]

const queryClient = new QueryClient()

const App = () => {
  const [networkType, setNetworkType] = useState<NetworkType>('op')

  const opChains = useMemo<[Chain, ...Chain[]]>(() => {
    return configureOpChains({ type: networkType })
  }, [networkType])

  const config = useMemo<Config>(() => {
    return createConfig({
      chains: opChains,
      connectors,
      transports: opChains.reduce(
        (acc, chain) => {
          acc[chain.id] = http()
          return acc
        },
        {} as Record<number, Transport>,
      ),
    })
  }, [opChains])

  const onNetworkTypeChange = useCallback(
    (type: NetworkType) => {
      setNetworkType(type)
      localStorage.clear()
    },
    [setNetworkType],
  )

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Demo
          defaultChainId={opChains[0].id}
          type={networkType}
          onNetworkTypeChange={onNetworkTypeChange}
        />
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
