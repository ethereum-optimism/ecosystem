import {
  TIC_TAC_TOE_CONTRACT_ADDRESS,
  ticTacToeABI,
} from '@/constants/contracts'
import { useCallback } from 'react'
import { Address } from 'viem'
import { parseEventLogs } from 'viem/utils'
import { useAccount, usePublicClient, useWriteContract } from 'wagmi'

export const useJoinGame = () => {
  const { address } = useAccount()
  const { writeContractAsync, isPending, error } = useWriteContract()
  const publicClient = usePublicClient()

  const joinGame = useCallback(
    async (gameId: number) => {
      const hash = await writeContractAsync({
        abi: ticTacToeABI,
        address: TIC_TAC_TOE_CONTRACT_ADDRESS,
        functionName: 'joinGame',
        args: [address as Address, BigInt(gameId)],
      })

      const receipt = await publicClient?.waitForTransactionReceipt({ hash })
      const logs = parseEventLogs({
        abi: ticTacToeABI,
        logs: receipt?.logs ?? [],
      })

      return { hash, logs }
    },
    [address, publicClient, writeContractAsync],
  )

  return { joinGame, isPending, error }
}
