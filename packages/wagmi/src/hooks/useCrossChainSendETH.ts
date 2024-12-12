import {
  contracts,
  type CrossChainSendETHParameters,
  superchainWETHABI,
} from '@eth-optimism/viem'
import { useCallback } from 'react'
import { useConfig, useWriteContract } from 'wagmi'

export const useCrossChainSendETH = () => {
  const config = useConfig()
  const { writeContractAsync, isError, isPending, isSuccess } =
    useWriteContract({ config })

  const crossChainSendETH = useCallback(
    (params: CrossChainSendETHParameters) => {
      const { to, chainId, value } = params

      return writeContractAsync({
        abi: superchainWETHABI,
        address: contracts.superchainWETH.address,
        value,
        functionName: 'sendETH',
        args: [to, BigInt(chainId)],
      })
    },
    [writeContractAsync],
  )

  return { crossChainSendETH, isError, isPending, isSuccess }
}
