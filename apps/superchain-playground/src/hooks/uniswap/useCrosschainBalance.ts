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
    query: { enabled: useLocalBalance, refetchInterval: 100 },
  })

  // remote balance (native tokens on chain B)
  const useRemoteBalance =
    !!owner && !!token.address && token.nativeChainId === 902
  const { data: remoteBalance } = useBalanceWagmi({
    address: owner,
    token: token.address,
    chainId: token.nativeChainId,
    query: { enabled: useRemoteBalance, refetchInterval: 100 },
  })

  // ref balance (native token on other chain)
  const useLocalRefBalance =
    !!owner && !!token.refAddress && token.nativeChainId === 902
  const { data: localRefBalance } = useBalanceWagmi({
    address: owner,
    chainId: 901,
    token: token.refAddress,
    query: { enabled: useLocalRefBalance, refetchInterval: 100 },
  })

  const localBalanceValue = useLocalBalance ? localBalance?.value ?? 0n : 0n
  const remoteBalanceValue = useRemoteBalance ? remoteBalance?.value ?? 0n : 0n
  const localRefBalanceValue = useLocalRefBalance
    ? localRefBalance?.value ?? 0n
    : 0n

  const balance = localBalanceValue + localRefBalanceValue + remoteBalanceValue
  return {
    balance,
    localRefBalance: localRefBalanceValue,
    remoteBalance: remoteBalanceValue,
  }
}
