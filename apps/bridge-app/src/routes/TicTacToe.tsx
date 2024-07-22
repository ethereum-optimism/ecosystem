import { CreateGameDialog } from '@/components/tictactoe/CreateGameDialog'
import { Game } from '@/components/tictactoe/Game'
import { JoinGameDialog } from '@/components/tictactoe/JoinGameDialog'
import { anvil1, anvil2 } from '@/constants/chains'
import { SupportedNetworks } from '@/providers/SupportedNetworks'
import { Text } from '@eth-optimism/ui-components'
import { useParams } from 'react-router'
import { Chain } from 'viem/chains'

const supportedChains: Chain[] = [anvil1, anvil2]

export const TicTacToe = () => {
  const params = useParams()
  const gameId = params['game-id']

  return (
    <SupportedNetworks chains={supportedChains}>
      {gameId ? (
        <Game id={parseInt(gameId)} />
      ) : (
        <div className="flex flex-col max-w-[960px] gap-3 w-full pt-6">
          <Text className="text-xl font-retro text-center pb-6">TicTacToe</Text>
          <CreateGameDialog />
          <JoinGameDialog />
        </div>
      )}
    </SupportedNetworks>
  )
}
