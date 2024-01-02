import { Token } from '@eth-optimism/op-app'
import { Address, Chain, erc20Abi, formatUnits } from 'viem'
import { useAccount, useBalance, useReadContract } from 'wagmi'
import { GetBalanceErrorType, ReadContractErrorType } from 'wagmi/actions'

export type UseReadBalanceArgs = {
  chain: Chain
  selectedToken: Token
}

export type UseReadBalanceReturnType = {
  data: {
    value: bigint
    formatted: string
    decimals: number
  }
  isPending: boolean
  isError: boolean
  error?: GetBalanceErrorType | ReadContractErrorType | null
}

export const useReadBalance = ({
  chain,
  selectedToken,
}: UseReadBalanceArgs) => {
  const { address } = useAccount()
  const isETH = selectedToken.extensions.opTokenId.toLowerCase() === 'eth'

  const nativeBalance = useBalance({
    chainId: chain.id,
    address: address,
    query: {
      enabled: isETH,
    },
  })

  const tokenBalance = useReadContract({
    address: selectedToken.address,
    chainId: chain.id,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address as Address],
    query: {
      enabled: !isETH,
    },
  })

  const balance = isETH ? nativeBalance.data?.value : tokenBalance.data
  const isPending = isETH ? nativeBalance.isPending : tokenBalance.isPending
  const isError = isETH ? nativeBalance.isError : tokenBalance.isError
  const error = isETH ? nativeBalance.error : tokenBalance.error

  return {
    data: {
      value: balance ?? 0n,
      formatted: formatUnits(balance ?? 0n, selectedToken.decimals),
      decimals: selectedToken.decimals,
    },
    isPending,
    isError,
    error,
  } as UseReadBalanceReturnType
}
