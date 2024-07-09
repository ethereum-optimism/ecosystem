import { SupportedNetworks } from '@/providers/SupportedNetworks'
import { optimismSepolia, foundry, Chain } from 'viem/chains'

const supportedChains: Chain[] = [optimismSepolia]

if (import.meta.env.VITE_DEPLOYMENT_ENV === 'local') {
  supportedChains.push(foundry)
}

export const TicTacToe = () => {
  return (
    <SupportedNetworks chains={supportedChains}>
      <div>Tic tac toe coming soon!</div>
    </SupportedNetworks>
  )
}
