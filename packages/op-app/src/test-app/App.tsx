import './App.css'

import { useCallback, useEffect, useState } from 'react'
import { formatEther } from 'viem'
import type { Connector } from 'wagmi'
import { useAccount, useConnect } from 'wagmi'
import { walletConnect } from 'wagmi/connectors'

import type { NetworkType } from '..'
import { networkPairsByGroup } from '..'
import { useIsNetworkUnsupported } from '../hooks/useIsNetworkUnsupported'
import { useL1PublicClient } from '../hooks/useL1PublicClient'
import { useL2PublicClient } from '../hooks/useL2PublicClient'
import { useOPNetwork } from '../hooks/useOPNetwork'
import { OPAppProvider } from '../providers/OPAppProvider'

const connectors = [
  walletConnect({ projectId: 'e9c485da698064d6df5c19c5d12a845c' }),
]

const Demo = () => {
  const [chainId, setChainId] = useState<number | undefined>(undefined)
  const [type, setNetworkType] = useState<NetworkType>('op')

  const [l1Balance, setL1Balance] = useState<bigint | undefined>(undefined)
  const [l2Balance, setL2Balance] = useState<bigint | undefined>(undefined)

  const { address } = useAccount()
  const { networkPair } = useOPNetwork({ type, chainId })
  const { isUnsupported } = useIsNetworkUnsupported()
  const { connect, connectors } = useConnect()

  const { l1PublicClient } = useL1PublicClient({ type, chainId })
  const { l2PublicClient } = useL2PublicClient({ type, chainId })

  const onConnectWallet = useCallback(
    (connector: Connector) => {
      connect({ connector })
    },
    [connect],
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
      <button key={group} onClick={() => setNetworkType(group as NetworkType)}>
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

const App = () => (
  <OPAppProvider connectors={connectors}>
    <Demo />
  </OPAppProvider>
)

export default App
