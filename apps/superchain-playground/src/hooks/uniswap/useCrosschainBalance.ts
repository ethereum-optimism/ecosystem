import { type Address } from 'viem'
import { useBalance as useBalanceWagmi } from 'wagmi'

interface Token {
  symbol: string
  name: string
  decimals: number
  address?: Address

  nativeChainId?: number
  refAddress?: Address
}

export const useCrosschainBalance = ({
  token,
  owner,
}: {
  token: Token
  owner?: Address
}) => {
  // native balance (native tokens + eth)
  const useLocalBalance = !!owner && !token.refAddress
  const { data: localBalance } = useBalanceWagmi({
    address: owner,
    chainId: 901,
    token: token.address,
    query: { enabled: useLocalBalance },
  })

  // remote balance (native tokens on chain B)
  const useRemoteBalance =
    !!owner && !!token.address && token.nativeChainId === 902
  const { data: remoteBalance } = useBalanceWagmi({
    address: owner,
    token: token.address,
    chainId: token.nativeChainId,
    query: { enabled: useRemoteBalance },
  })

  // ref balance (native token on other chain)
  const useLocalRefBalance =
    !!owner && !!token.refAddress && token.nativeChainId === 902
  const { data: localRefBalance } = useBalanceWagmi({
    address: owner,
    chainId: 901,
    token: token.refAddress,
    query: { enabled: useLocalRefBalance },
  })

  return (
    (useLocalBalance ? localBalance?.value ?? 0n : 0n) +
    (useRemoteBalance ? remoteBalance?.value ?? 0n : 0n) +
    (useLocalRefBalance ? localRefBalance?.value ?? 0n : 0n)
  )
}
