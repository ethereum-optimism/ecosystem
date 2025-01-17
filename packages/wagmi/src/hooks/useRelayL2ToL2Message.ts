import type { RelayL2ToL2MessageParameters } from '@eth-optimism/viem'
import { contracts, l2ToL2CrossDomainMessengerAbi } from '@eth-optimism/viem'
import { useCallback } from 'react'
import { useConfig, useWriteContract } from 'wagmi'

export const useRelayL2ToL2Message = () => {
  const config = useConfig()
  const { writeContractAsync, isError, isPending, isSuccess } =
    useWriteContract({ config })

  const relayMessage = useCallback(
    (params: RelayL2ToL2MessageParameters) => {
      const {
        sentMessageId,
        sentMessagePayload,
        nonce,
        maxFeePerGas,
        maxPriorityFeePerGas,
        chain,
        gas,
      } = params

      return writeContractAsync({
        abi: l2ToL2CrossDomainMessengerAbi,
        address: contracts.l2ToL2CrossDomainMessenger.address,
        functionName: 'relayMessage',
        args: [sentMessageId, sentMessagePayload],
        chain,
        gas: gas ? gas : undefined,
        nonce,
        maxFeePerGas,
        maxPriorityFeePerGas,
      })
    },
    [writeContractAsync],
  )

  return { relayMessage, isError, isPending, isSuccess }
}
