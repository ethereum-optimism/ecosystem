import type { ExecuteL2ToL2MessageParameters } from '@eth-optimism/viem'
import { contracts, l2ToL2CrossDomainMessengerABI } from '@eth-optimism/viem'
import { useCallback } from 'react'
import { useConfig, useWriteContract } from 'wagmi'

export const useExecuteL2ToL2CDMMessage = () => {
  const config = useConfig()
  const { writeContractAsync, isError, isSuccess, isLoading, data } =
    useWriteContract({
      config,
    })

  const executeMessage = useCallback(
    (params: {
      id: ExecuteL2ToL2MessageParameters['id']
      message: ExecuteL2ToL2MessageParameters['message']
    }) => {
      const { id, message } = params

      return writeContractAsync({
        abi: l2ToL2CrossDomainMessengerABI,
        address: contracts.l2ToL2CrossDomainMessenger.address,
        functionName: 'relayMessage',
        args: [id, message],
      })
    },
    [writeContractAsync],
  )

  return { executeMessage, isError, isLoading, isSuccess, data }
}
