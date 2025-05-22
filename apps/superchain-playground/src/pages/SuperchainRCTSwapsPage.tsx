import { contracts } from '@eth-optimism/viem'
import type { Network } from '@eth-optimism/viem/chains';
import { networks, op, unichain } from '@eth-optimism/viem/chains'
import { useBytecode } from 'wagmi'

import { RCTSwaps } from '@/components/RCTSwaps';
import { SupportedNetworks } from '@/components/SupportedNetworks'
import { useConfig } from '@/stores/useConfig'

const InteropActivated = ({network, children}: {network: Network, children: React.ReactNode}) => {
  const { data: bytecode, isLoading } = useBytecode({
    address: contracts.l2ToL2CrossDomainMessenger.address,
    chainId: network.chains[0]!.id,
  })

  console.log('bytecode', bytecode)
  if (isLoading) {
    return <div>Verifying interop contracts...</div>
  }
  if (!bytecode || bytecode.length === 0) {
    return <div>Interop contracts not found</div>
  }

  return (<> {children} </>)
}

export const SuperchainRctSwapsPage = () => {
  const { networkName } = useConfig()
  const network = networks[networkName]

  const interopNetwork = networkName !== 'mainnet' ? network : {...network, chains: [op, unichain]}
  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto">
      <SupportedNetworks networks={['mainnet', 'interop-alpha', 'supersim']}>
        <InteropActivated network={interopNetwork}>
          <RCTSwaps network={interopNetwork} />
        </InteropActivated>
      </SupportedNetworks>
    </div>
  )
}

