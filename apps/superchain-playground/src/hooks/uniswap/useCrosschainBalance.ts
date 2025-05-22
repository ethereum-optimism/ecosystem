import { chainById } from '@eth-optimism/viem/chains'
import { useAccount, useBalance as useBalanceWagmi } from 'wagmi'

import { getCurrency } from '@/actions/uniswap/getCurrency'
import type { Token } from '@/types/Token'

export const useCrosschainBalance = ({ token }: { token: Token }) => {
  const { address } = useAccount()

  const chain = chainById[901]
  const currency = getCurrency(token, chain!)

  // native balance (native tokens + eth)
  const useLocalBalance = !!address && !token.nativeChainId
  const { data: localBalance } = useBalanceWagmi({
    address: address,
    chainId: 901,
    token: token.address,
    query: { enabled: useLocalBalance, refetchInterval: 100 },
  })

  // remote balance (native tokens on chain B)
  const useRemoteBalance =
    !!address && !!token.address && token.nativeChainId === 902
  const { data: remoteBalance } = useBalanceWagmi({
    address: address,
    token: token.address,
    chainId: token.nativeChainId,
    query: { enabled: useRemoteBalance, refetchInterval: 100 },
  })

  // ref balance (native token on other chain)
  const useLocalRefBalance =
    !!address && currency !== token.address && token.nativeChainId === 902
  const { data: localRefBalance } = useBalanceWagmi({
    address: address,
    chainId: 901,
    token: currency,
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
