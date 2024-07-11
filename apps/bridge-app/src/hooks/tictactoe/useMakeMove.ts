import {
  TIC_TAC_TOE_CONTRACT_ADDRESS,
  ticTacToeABI,
} from '@/constants/contracts'
import { useCallback } from 'react'
import { Address } from 'viem'
import { parseEventLogs } from 'viem/utils'
import { useAccount, usePublicClient, useWriteContract } from 'wagmi'

export const useMakeMove = (gameId: number) => {
  const { address } = useAccount()
  const { writeContractAsync, isPending, error } = useWriteContract()
  const publicClient = usePublicClient()

  const makeMove = useCallback(
    async (x: number, y: number) => {
      const hash = await writeContractAsync({
        abi: ticTacToeABI,
        address: TIC_TAC_TOE_CONTRACT_ADDRESS,
        functionName: 'makeMove',
        args: [address as Address, BigInt(gameId), x, y],
      })

      const receipt = await publicClient.waitForTransactionReceipt({ hash })
      const logs = parseEventLogs({ abi: ticTacToeABI, logs: receipt.logs })

      return { hash, logs }
    },
    [address, gameId, publicClient, writeContractAsync],
  )

  return { makeMove, isPending, error }
}
