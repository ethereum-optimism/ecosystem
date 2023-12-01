import { useCallback } from 'react'
import type { Connector} from 'wagmi';
import { useAccount, useConnect } from 'wagmi'
import { walletConnect } from 'wagmi/connectors'

import { useIsNetworkUnsupported } from '../hooks/useIsNetworkUnsupported'
import { useNetworkPair } from '../hooks/useNetworkPair'
import { OPAppProvider } from '../providers/OPAppProvider'

const connectors = [
  walletConnect({ projectId: 'e9c485da698064d6df5c19c5d12a845c' })
]

const Demo = () => {
  const { chain } = useAccount()
  const { currentNetworkPair } = useNetworkPair()
  const { isCurrentNetworkUnsupported } = useIsNetworkUnsupported()
  const { connect, connectors } = useConnect()
  
  const onConnectWallet = useCallback((connector: Connector) => {
    connect({ connector })
  }, [connect])

  return (
    <div>
      <center>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => onConnectWallet(connector)}
          >
            {connector.name}
          </button>
        ))}
        <h1>Current Network: {chain?.name ?? 'Not Connected'}</h1>
        <h1>Network Unsupported: {isCurrentNetworkUnsupported?.toString() ?? ''}</h1>
        <h2>
          Network Pair
          <div>L1: {currentNetworkPair?.l1.name}</div>
          <div>L2: {currentNetworkPair?.l2.name}</div>
        </h2>
      </center>
    </div>
  )
}

const App = () => (
  <OPAppProvider connectors={connectors}>
    <Demo />
  </OPAppProvider>
)

export default App
