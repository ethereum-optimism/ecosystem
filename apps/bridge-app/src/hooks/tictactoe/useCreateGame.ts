import {
  TIC_TAC_TOE_CONTRACT_ADDRESS,
  ticTacToeABI,
} from '@/constants/contracts'
import { useCallback } from 'react'
import { AbiStateMutability, Address, ContractFunctionArgs, Hash, encodeFunctionData } from 'viem'
import { useAccount, usePublicClient, useSwitchChain, useWriteContract } from 'wagmi'
import { useInterop } from '../interop/useInterop'
import { gamePublicClient, getGameId, isInterop } from './gameClient'

type CreateGameFunctionData = {
  abi: typeof ticTacToeABI
  functionName: 'createGame'
  args: ContractFunctionArgs<typeof ticTacToeABI, AbiStateMutability, 'createGame'>
}

export const useCreateGame = () => {
  const { address, chainId } = useAccount()
  const { writeContractAsync, isPending } = useWriteContract()
  const { sendMessage, executeMessage, waitForL2ToL2MessageReceipt } = useInterop()
  const { switchChainAsync } = useSwitchChain()
  const publicClient = usePublicClient({ chainId })

  const createGame = useCallback(async () => {
    let hash: Hash | undefined

    const functionData: CreateGameFunctionData = {
      abi: ticTacToeABI,
      functionName: 'createGame',
      args: [address as Address],
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

    const gameId = await getGameId(hash)
  
    return { hash, gameId }
  }, [address, publicClient, switchChainAsync, writeContractAsync])

  return { createGame, isPending }
}
