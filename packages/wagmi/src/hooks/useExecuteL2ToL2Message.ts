import type { ExecuteL2ToL2MessageParameters } from '@eth-optimism/viem'
import { contracts, crossL2InboxABI } from '@eth-optimism/viem'
import { useCallback } from 'react'
import { useConfig, useWriteContract } from 'wagmi'

export const useExecuteL2ToL2Message = () => {
  const config = useConfig()
  const { writeContractAsync } = useWriteContract({ config })

  const sendMessage = useCallback(
    (params: ExecuteL2ToL2MessageParameters) => {
      const {
        id,
        target,
        message,
        nonce,
        maxFeePerGas,
        maxPriorityFeePerGas,
        chain,
        gas,
      } = params

      return writeContractAsync({
        abi: crossL2InboxABI,
        address: contracts.crossL2Inbox.address,
        functionName: 'executeMessage',
        args: [id, target, message],
        chain,
        gas: gas ? gas : undefined,
        nonce,
        maxFeePerGas,
        maxPriorityFeePerGas,
      })
    },
    [writeContractAsync],
  )

  return { sendMessage }
}
