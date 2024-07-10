import { CreateGameDialog } from '@/components/tictactoe/CreateGameDialog'
import { Game } from '@/components/tictactoe/Game'
import { JoinGameDialog } from '@/components/tictactoe/JoinGameDialog'
import { SupportedNetworks } from '@/providers/SupportedNetworks'
import { TicTacToeProvider } from '@/providers/TicTacToeProvider'
import { Text } from '@eth-optimism/ui-components'
import { useParams } from 'react-router'
import { optimismSepolia, foundry, Chain } from 'viem/chains'

const supportedChains: Chain[] = [optimismSepolia]

if (import.meta.env.VITE_DEPLOYMENT_ENV === 'local') {
  supportedChains.push(foundry)
}

export const TicTacToe = () => {
  const params = useParams()
  const gameId = params['game-id']

  return (
    <SupportedNetworks chains={supportedChains}>
      <TicTacToeProvider gameId={gameId ? parseInt(gameId) : undefined}>
        {gameId ? (
          <Game />
        ) : (
          <div className="flex flex-col max-w-[960px] gap-3 w-full pt-6">
            <Text className="text-xl font-retro text-center pb-6">
              TicTacToe
            </Text>
            <CreateGameDialog />
            <JoinGameDialog />
          </div>
        )}
      </TicTacToeProvider>
    </SupportedNetworks>
  )
}
