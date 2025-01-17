import type { SendSuperchainERC20Parameters } from '@eth-optimism/viem'
import { contracts, superchainTokenBridgeAbi } from '@eth-optimism/viem'
import { useCallback } from 'react'
import { useConfig, useWriteContract } from 'wagmi'

export const useSendSuperchainERC20 = () => {
  const config = useConfig()

  const { writeContractAsync, isError, isPending, isSuccess } =
    useWriteContract({ config })

  const sendSuperchainERC20 = useCallback(
    (params: SendSuperchainERC20Parameters) => {
      const { tokenAddress, to, amount, chainId } = params

      return writeContractAsync({
        abi: superchainTokenBridgeAbi,
        address: contracts.superchainTokenBridge.address,
        functionName: 'sendERC20',
        args: [tokenAddress, to, amount, BigInt(chainId)],
      })
    },
    [writeContractAsync],
  )

  return { sendSuperchainERC20, isError, isPending, isSuccess }
}
