import {
  TIC_TAC_TOE_CONTRACT_ADDRESS,
  ticTacToeABI,
} from '@/constants/contracts'
import { gamePublicClient } from '@/utils/gameClient'
import { useReadContract, useWatchContractEvent } from 'wagmi'

export const useGameState = (gameId: number) => {
  const { refetch, ...res } = useReadContract({
    abi: ticTacToeABI,
    chainId: gamePublicClient.chain.id,
    address: TIC_TAC_TOE_CONTRACT_ADDRESS,
    functionName: 'getGame',
    args: [BigInt(gameId)],
  })

  useWatchContractEvent({
    abi: ticTacToeABI,
    address: TIC_TAC_TOE_CONTRACT_ADDRESS,
    eventName: 'PlayerMadeMove',
    poll: true,
    pollingInterval: 10_000,
    args: { gameId: BigInt(gameId) },
    onLogs: () => refetch(),
  })

  return { ...res, refetch }
}
