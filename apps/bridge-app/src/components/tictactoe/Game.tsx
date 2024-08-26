import { TicTacToeGameState, TicTacToePlayerTurn } from '@/constants/contracts'
import { useGameState } from '@/hooks/tictactoe/useGameState'
import { cn } from '@/utils'
import { getStatus } from '@/utils/tictactoe'
import { shortenAddress } from '@eth-optimism/op-app'
import { Badge, Text } from '@eth-optimism/ui-components'
import { useCallback, useMemo, useState } from 'react'
import { Address, formatEther } from 'viem'
import { useAccount, useBalance } from 'wagmi'
import { MakeMoveDialog } from '@/components/tictactoe/MakeMoveDialog'

type GameCellValue = 1 | 2 | 0

type GameCellProps = {
  position: [number, number]
  value: GameCellValue
  isYourTurn: boolean
  onMakeMove?: (x: number, y: number) => void
}

export type GameProps = {
  id: number
}

const GameCell = ({
  isYourTurn,
  value,
  onMakeMove,
  position,
}: GameCellProps) => {
  const isEmpty = value === 0
  const cursorType = isYourTurn ? 'cursor-pointer' : 'cursor-default'

  return (
    <div
      onClick={
        isEmpty && isYourTurn
          ? () => onMakeMove?.(position[0], position[1])
          : undefined
      }
      className={cn(
        'flex content-center justify-center border-1 min-w-[120px] min-h-[120px] flex-wrap',
        cursorType,
      )}
    >
      {!isEmpty && (
        <Text className="color-white text-3xl font-retro">
          {value === 1 ? 'X' : 'O'}
        </Text>
      )}
    </div>
  )
}

export const Game = ({ id }: GameProps) => {
  const { address, chainId } = useAccount()
  const { data: balance, refetch: refetchBalance } = useBalance({
    address,
    chainId,
  })

  const [nextMove, setNextMove] = useState<[number, number] | undefined>(
    undefined,
  )
  const [showDialog, setShowDialog] = useState<boolean>(false)

  const gameState = useGameState(id)

  const isPlayer1 = address === gameState.data?.player1
  const isPlayer2 = address === gameState.data?.player2

  const isYourTurn = useMemo(() => {
    if (gameState.data?.state !== TicTacToeGameState.Playing) {
      return false
    }

    if (
      gameState.data.currentTurn === TicTacToePlayerTurn.PlayerOne &&
      isPlayer1
    ) {
      return true
    }

    if (
      gameState.data.currentTurn === TicTacToePlayerTurn.PlayerTwo &&
      isPlayer2
    ) {
      return true
    }

    return false
  }, [address, gameState, isPlayer1, isPlayer2])

  const handleMakeMove = useCallback(
    async (x: number, y: number) => {
      if (!isYourTurn) {
        return
      }
      setShowDialog(true)
      setNextMove([x, y])
    },
    [isYourTurn],
  )

  const handleFinishMakingMove = useCallback(() => {
    setShowDialog(false)
    gameState.refetch()
    refetchBalance()
  }, [gameState, refetchBalance])

  return (
    <div className="flex flex-col w-full items-center">
      <div className="max-w-[960px] align-center justify-center">
        <Badge
          className="w-full cursor-default hover:bg-default"
          variant="default"
        >
          <Text className="w-full font-retro py-3 px-1 text-center">
            {getStatus(
              gameState.data?.state as number,
              isYourTurn,
              isPlayer1,
              isPlayer2,
            )}
          </Text>
        </Badge>
        <div className="grid grid-rows-3 grid-cols-3 border-1 mt-6">
          {gameState.data?.board.map((row, rowIndex) => {
            return row.map((_, colIndex) => (
              <GameCell
                key={`${rowIndex}_${colIndex}`}
                value={
                  gameState.data.board[rowIndex][colIndex] as GameCellValue
                }
                position={[rowIndex, colIndex]}
                onMakeMove={handleMakeMove}
                isYourTurn={isYourTurn}
              />
            ))
          })}
        </div>
        <div className="flex flex-col mt-3 text-center">
          <Text className="font-retro">
            Player: {shortenAddress(address as Address)}
          </Text>
          {balance && (
            <Text className="font-retro">
              Balance: {formatEther(balance?.value)}
            </Text>
          )}
        </div>
      </div>
      <MakeMoveDialog
        isOpen={showDialog}
        onOpenChange={setShowDialog}
        gameId={id}
        position={nextMove}
        onComplete={handleFinishMakingMove}
      />
    </div>
  )
}
