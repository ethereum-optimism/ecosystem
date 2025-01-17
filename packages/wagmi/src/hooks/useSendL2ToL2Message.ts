import type { SendL2ToL2MessageParameters } from '@eth-optimism/viem'
import { contracts, l2ToL2CrossDomainMessengerAbi } from '@eth-optimism/viem'
import { useCallback } from 'react'
import { useConfig, useWriteContract } from 'wagmi'

export const useSendL2ToL2Message = () => {
  const config = useConfig()
  const { writeContractAsync, isError, isPending, isSuccess } =
    useWriteContract({ config })

  const sendMessage = useCallback(
    (params: SendL2ToL2MessageParameters) => {
      const { destinationChainId, target, message } = params

      return writeContractAsync({
        abi: l2ToL2CrossDomainMessengerAbi,
        address: contracts.l2ToL2CrossDomainMessenger.address,
        functionName: 'sendMessage',
        args: [BigInt(destinationChainId), target, message],
      })
    },
    [writeContractAsync],
  )

  return { sendMessage, isError, isPending, isSuccess }
}
