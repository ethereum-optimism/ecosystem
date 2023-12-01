import { useSimulateDepositETH } from 'op-wagmi'
import { useCallback } from 'react'
import { parseEther } from 'viem'
import type { Connector} from 'wagmi';
import { useAccount, useConnect } from 'wagmi'
import { walletConnect } from 'wagmi/connectors'

import { useIsNetworkUnsupported } from '../hooks/useIsNetworkUnsupported'
import { useNetworkPair } from '../hooks/useNetworkPair'
import { useOPWagmiConfig } from '../hooks/useOPWagmiConfig'
import { OPAppProvider } from '../providers/OPAppProvider'

const SimulateButton = () => {
  const { address } = useAccount()
  const { currentNetworkPair } = useNetworkPair()
  const { opConfig } = useOPWagmiConfig()

  const { status: simulateStatus, refetch: simulateDepositETH } = useSimulateDepositETH({
    args: {
      to: address as `0x{string}`,
      amount: parseEther('0.01'),
    },
    l2ChainId: currentNetworkPair?.l2.id ?? 0,
    query: { enabled: false, retry: false },
    // @ts-ignore type isn't expored currently
    config: opConfig,
  })

  return (
    <button onClick={() => {
      simulateDepositETH()
      console.log(simulateStatus)
    }}>Simulate</button>
  )
}

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
        {chain?.id && <SimulateButton />}
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
