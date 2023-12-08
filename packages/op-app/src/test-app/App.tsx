import './App.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Chain, Transport } from 'viem'
import { formatEther, http } from 'viem'
import type { Config, Connector } from 'wagmi'
import {
  createConfig,
  useAccount,
  useConfig,
  useConnect,
  WagmiProvider,
} from 'wagmi'
import { walletConnect } from 'wagmi/connectors'

import type { NetworkType } from '..'
import { networkPairsByGroup } from '..'
import { useIsNetworkUnsupported } from '../hooks/useIsNetworkUnsupported'
import { useL1PublicClient } from '../hooks/useL1PublicClient'
import { useL2PublicClient } from '../hooks/useL2PublicClient'
import { useOPNetwork } from '../hooks/useOPNetwork'
import { configureOpChains } from '../utils'

type DemoProps = {
  type: NetworkType
  defaultChainId: number
  onNetworkTypeChange: (type: NetworkType) => void
}

const connectors = [
  walletConnect({ projectId: 'e9c485da698064d6df5c19c5d12a845c' }),
]

const queryClient = new QueryClient()

const Demo = ({ type, onNetworkTypeChange }: DemoProps) => {
  const config = useConfig()

  const [chainId, setChainId] = useState<number | undefined>()
  const [l1Balance, setL1Balance] = useState<bigint | undefined>(undefined)
  const [l2Balance, setL2Balance] = useState<bigint | undefined>(undefined)

  const { address } = useAccount()
  const { networkPair } = useOPNetwork({
    type,
    chainId: chainId ?? config.chains[0].id,
  })
  const { isUnsupported } = useIsNetworkUnsupported()
  const { connect, connectors } = useConnect()

  const { l1PublicClient } = useL1PublicClient({
    type,
    chainId: networkPair.l1.id,
  })
  const { l2PublicClient } = useL2PublicClient({
    type,
    chainId: networkPair.l2.id,
  })

  const onConnectWallet = useCallback(
    (connector: Connector) => {
      connect({ connector })
    },
    [connect],
  )

  const onChangeNetwork = useCallback(
    (networkType: NetworkType) => {
      setChainId(undefined)
      onNetworkTypeChange(networkType)
    },
    [setChainId, onNetworkTypeChange],
  )

  useEffect(() => {
    if (!address) {
      return
    }

    ;(async () => {
      const l1Balance = await l1PublicClient.getBalance({ address })
      const l2Balance = await l2PublicClient.getBalance({ address })
      setL1Balance(l1Balance)
      setL2Balance(l2Balance)
    })()
  }, [address, l1PublicClient, l2PublicClient, setL1Balance, setL2Balance])

  const networkInfo = (
    <div>
      <h2>
        Network Pair
        <div>L1: {networkPair?.l1.name}</div>
        <div>L2: {networkPair?.l2.name}</div>
      </h2>
      <h2>
        <div>Account: {address}</div>
        <div>L1 Balance: {l1Balance ? formatEther(l1Balance) : ''}</div>
        <div>L2 Balance: {l2Balance ? formatEther(l2Balance) : ''}</div>
      </h2>
    </div>
  )

  const groupTypes = Object.keys(networkPairsByGroup).map((group) => {
    return (
      <button key={group} onClick={() => onChangeNetwork(group as NetworkType)}>
        {group}
      </button>
    )
  })

  const networkTypes = Object.values(networkPairsByGroup[type] ?? []).map(
    ([l1, l2]) => {
      return (
        <button key={l2.id} onClick={() => setChainId(l1.id)}>
          {l1.name}/{l2.name}
        </button>
      )
    },
  )
  return (
    <div className="app">
      <div className="row">
        Connectors:
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => onConnectWallet(connector)}
          >
            {connector.name}
          </button>
        ))}
      </div>
      <div className="row">
        Chains:
        {groupTypes}
      </div>
      <div className="row">
        Supported Networks:
        {networkTypes}
      </div>
      {isUnsupported ? <h1>Network Not Supported by App</h1> : networkInfo}
    </div>
  )
}

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
