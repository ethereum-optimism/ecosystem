import {
  TIC_TAC_TOE_CONTRACT_ADDRESS,
  ticTacToeABI,
} from '@/constants/contracts'
import { useCallback } from 'react'
import { AbiStateMutability, Address, ContractFunctionArgs, Hash, encodeFunctionData } from 'viem'
import { parseEventLogs } from 'viem/utils'
import { useAccount, usePublicClient, useSwitchChain, useWriteContract } from 'wagmi'
import { gamePublicClient, isInterop } from './gameClient'
import { useInterop } from '../interop/useInterop'

type JoinGameFunctionData = {
  abi: typeof ticTacToeABI
  functionName: 'joinGame'
  args: ContractFunctionArgs<typeof ticTacToeABI, AbiStateMutability, 'joinGame'>
}

export const useJoinGame = () => {
  const { address, chainId } = useAccount()
  const { writeContractAsync, isPending, error } = useWriteContract()
  const { sendMessage, executeMessage, waitForL2ToL2MessageReceipt } = useInterop()
  const { switchChainAsync } = useSwitchChain()
  const publicClient = usePublicClient({ chainId })

  const joinGame = useCallback(
    async (gameId: number) => {
      let hash: Hash | undefined
      
      const functionData: JoinGameFunctionData = {
        abi: ticTacToeABI,
        functionName: 'joinGame',
        args: [address as Address, BigInt(gameId)],
      }

      if (isInterop(publicClient.chain.id)) {
        const encodedMessage = encodeFunctionData(functionData)

        const sendMessageHash = await sendMessage({
          chainId: gamePublicClient.chain.id,
          target: TIC_TAC_TOE_CONTRACT_ADDRESS,
          message: encodedMessage,
        })

        const { id } = await waitForL2ToL2MessageReceipt(sendMessageHash)
        await switchChainAsync({ chainId: gamePublicClient.chain.id })
        localStorage.clear()

        hash = await executeMessage({ id, message: encodedMessage, target: TIC_TAC_TOE_CONTRACT_ADDRESS })
      } else {
        hash = await writeContractAsync({
          address: TIC_TAC_TOE_CONTRACT_ADDRESS,
          ...functionData,
        })
      }

      const receipt = await publicClient.waitForTransactionReceipt({ hash })
      const logs = parseEventLogs({ abi: ticTacToeABI, logs: receipt.logs })

      return { hash, logs }
    },
    [address, publicClient, writeContractAsync],
  )

  return { joinGame, isPending, error }
}
