import { useCallback, useEffect, useState } from 'react'
import { formatEther } from 'viem'
import type { Connector } from 'wagmi'
import { useAccount, useConnect } from 'wagmi'
import { walletConnect } from 'wagmi/connectors'

import { useIsNetworkUnsupported } from '../hooks/useIsNetworkUnsupported'
import { useL1PublicClient } from '../hooks/useL1PublicClient'
import { useL2PublicClient } from '../hooks/useL2PublicClient'
import { useNetworkPair } from '../hooks/useNetworkPair'
import { OPAppProvider } from '../providers/OPAppProvider'

const connectors = [
  walletConnect({ projectId: 'e9c485da698064d6df5c19c5d12a845c' }),
]

const Demo = () => {
  const [l1Balance, setL1Balance] = useState<bigint | undefined>(undefined)
  const [l2Balance, setL2Balance] = useState<bigint | undefined>(undefined)

  const { address, chain } = useAccount()
  const { currentNetworkPair } = useNetworkPair()
  const { isCurrentNetworkUnsupported } = useIsNetworkUnsupported()
  const { connect, connectors } = useConnect()

  const { l1PublicClient } = useL1PublicClient()
  const { l2PublicClient } = useL2PublicClient()

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
      <h1>Current Network: {chain?.name ?? 'Not Connected'}</h1>
      <h2>
        Network Pair
        <div>L1: {currentNetworkPair?.l1.name}</div>
        <div>L2: {currentNetworkPair?.l2.name}</div>
      </h2>
      <h2>
        <div>Account: {address}</div>
        <div>L1 Balance: {l1Balance ? formatEther(l1Balance) : ''}</div>
        <div>L2 Balance: {l2Balance ? formatEther(l2Balance) : ''}</div>
      </h2>
    </div>
  )

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
        {isCurrentNetworkUnsupported ? (
          <h1>Network Not Supported by App</h1>
        ) : (
          networkInfo
        )}
      </center>
    </div>
  )
}

const App = () => (
  <OPAppProvider type="base" connectors={connectors}>
    <Demo />
  </OPAppProvider>
)

export default App
