import { Token } from '@eth-optimism/op-app'
import { useCallback } from 'react'
import { Address, erc20Abi } from 'viem'
import { useReadContract, useWriteContract } from 'wagmi'

export type UseERC20AllowanceArgs = {
  token: Token
  amount: bigint
  owner: Address
  spender: Address
}

export const useERC20Allowance = ({
  token,
  amount,
  owner,
  spender,
}: UseERC20AllowanceArgs) => {
  const { writeContractAsync } = useWriteContract()

  const allowance = useReadContract({
    abi: erc20Abi,
    address: token.address,
    chainId: token.chainId,
    functionName: 'allowance',
    args: [owner, spender],
    query: {
      enabled: token.extensions.opTokenId.toLowerCase() !== 'eth',
    },
  })

  const approve = useCallback(async () => {
    return await writeContractAsync({
      abi: erc20Abi,
      address: token.address,
      chainId: token.chainId,
      functionName: 'approve',
      args: [spender, amount],
    })
  }, [amount, token, spender])

  return {
    allowance,
    approve,
  }
}
