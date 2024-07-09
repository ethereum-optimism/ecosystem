import { SupportedNetworks } from '@/providers/SupportedNetworks'
import { optimismSepolia } from 'viem/chains'

const supportedChains = [optimismSepolia]

export const TicTacToe = () => {
  return (
    <SupportedNetworks chains={supportedChains}>
      <div>Tic tac toe coming soon!</div>
    </SupportedNetworks>
  )
}
