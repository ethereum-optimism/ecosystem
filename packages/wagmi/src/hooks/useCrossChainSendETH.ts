import { contracts, superchainWETHAbi } from '@eth-optimism/viem'
import type { SendETHParameters } from '@eth-optimism/viem/actions/interop'
import { useCallback } from 'react'
import { useConfig, useWriteContract } from 'wagmi'

export const useCrossChainSendETH = () => {
  const config = useConfig()
  const { writeContractAsync, isError, isPending, isSuccess } =
    useWriteContract({ config })

  const crossChainSendETH = useCallback(
    (params: SendETHParameters) => {
      const { to, chainId, value } = params

      return writeContractAsync({
        abi: superchainWETHAbi,
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
