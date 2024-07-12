import { TicTacToeGameState } from '@/constants/contracts'
import { BaseError, ContractFunctionRevertedError } from 'viem'

const status = {
  waitingForPlayer: 'Waiting for player to join.',
  yourTurn: 'Your turn',
  opponentsTurn: 'Waiting for opponent to make a move.',
  draw: 'Game has ended in a draw.',
  youWin: 'You won!',
  opponentWins: 'Your opponent won :(',
}

export function getMessageFromRevert(err: Error): string | undefined {
  if (!(err instanceof BaseError)) {
    return
  }

  const revertError = err.walk(
    (err) => err instanceof ContractFunctionRevertedError,
  )
  if (revertError instanceof ContractFunctionRevertedError) {
    return revertError.data?.args?.[0] as string
  }
}

export function getStatus(
  state: number,
  isYourTurn: boolean,
  isPlayer1: boolean,
  isPlayer2: boolean,
) {
  if (state === TicTacToeGameState.Playing) {
    return isYourTurn ? status.yourTurn : status.opponentsTurn
  } else if (state === TicTacToeGameState.Draw) {
    return status.draw
  } else if (state === TicTacToeGameState.PlayerOneWins) {
    return isPlayer1 ? status.youWin : status.opponentWins
  } else if (state === TicTacToeGameState.PlayerTwoWins) {
    return isPlayer2 ? status.youWin : status.opponentWins
  } else {
    return status.waitingForPlayer
  }
}
