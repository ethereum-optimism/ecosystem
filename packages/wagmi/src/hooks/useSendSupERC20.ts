import type { SendSupERC20Parameters } from '@eth-optimism/viem'
import { contracts, superchainTokenBridgeABI } from '@eth-optimism/viem'
import { useCallback } from 'react'
import { useConfig, useWriteContract } from 'wagmi'

export const useSendSupERC20 = () => {
  const config = useConfig()

  const { writeContractAsync, isError, isPending, isSuccess } =
    useWriteContract({ config })

  const sendSupERC20 = useCallback(
    (params: SendSupERC20Parameters) => {
      const { tokenAddress, to, amount, chainId } = params

      return writeContractAsync({
        abi: superchainTokenBridgeABI,
        address: contracts.superchainTokenBridge.address,
        functionName: 'sendERC20',
        args: [tokenAddress, to, amount, BigInt(chainId)],
      })
    },
    [writeContractAsync],
  )

  return { sendSupERC20, isError, isPending, isSuccess }
}
