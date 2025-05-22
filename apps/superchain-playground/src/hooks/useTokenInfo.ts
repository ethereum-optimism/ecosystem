import type { Address } from 'viem'
import { erc20Abi } from 'viem'
import { useBytecode, useReadContracts } from 'wagmi'

export const useTokenInfo = ({
  address,
  chainId,
}: {
  address?: Address
  chainId: number
}) => {
  const { data: code, isLoading: isCodeLoading } = useBytecode({
    address,
    chainId,
  })

  const abi = erc20Abi
  const { data: tokenData, isLoading: isTokenDataLoading } = useReadContracts({
    contracts: [
      { chainId, address, abi, functionName: 'symbol' },
      { chainId, address, abi, functionName: 'decimals' },
      { chainId, address, abi, functionName: 'name' },
    ],
  })

  const exists = code && code.length > 2
  const name = tokenData?.[2]?.result
  const symbol = tokenData?.[0]?.result
  const decimals = tokenData?.[1]?.result

  return {
    isLoading: isCodeLoading || isTokenDataLoading,
    tokenData: exists ? { name, symbol, decimals } : undefined,
  }
}
