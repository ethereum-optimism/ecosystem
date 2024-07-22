import {
  TIC_TAC_TOE_CONTRACT_ADDRESS,
  ticTacToeABI,
} from '@/constants/contracts'
import { useCallback } from 'react'
import { Address } from 'viem'
import { parseEventLogs } from 'viem/utils'
import { useAccount, usePublicClient, useWriteContract } from 'wagmi'

export const useCreateGame = () => {
  const { address } = useAccount()
  const { writeContractAsync, isPending } = useWriteContract()
  const publicClient = usePublicClient()

  const createGame = useCallback(async () => {
    const hash = await writeContractAsync({
      abi: ticTacToeABI,
      address: TIC_TAC_TOE_CONTRACT_ADDRESS,
      functionName: 'createGame',
      args: [address as Address],
    })

    const receipt = await publicClient?.waitForTransactionReceipt({ hash })
    const logs = parseEventLogs({
      abi: ticTacToeABI,
      logs: receipt?.logs ?? [],
    })
    const gameCreatedEvent = logs.find((log) => log.eventName === 'GameCreated')
    const gameId = gameCreatedEvent
      ? Number(gameCreatedEvent.args.gameId)
      : undefined

    return { hash, gameId }
  }, [address, publicClient, writeContractAsync])

  return { createGame, isPending }
}
