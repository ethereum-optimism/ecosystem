import { contracts } from '@eth-optimism/viem'
import { switchChain } from '@wagmi/core'
import { type Chain, erc20Abi } from 'viem'
import {
  useAccount,
  useBalance,
  useConfig,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'

import { getCurrency } from '@/actions/uniswap/getCurrency'
import { permit2Abi } from '@/constants/permit2Abi'
import { POSM_ADDRESS, V4_ROUTER_ADDRESS } from '@/hooks/uniswap/addresses'
import type { Token } from '@/types/Token'

const MAX_UINT160 = 2n ** 160n - 1n
const MAX_UINT48 = 2n ** 48n - 1n

export const useApproval = ({
  token,
  amount,
  chain,
  swapping = false,
}: {
  token: Token
  amount: bigint
  chain: Chain
  swapping?: boolean
}) => {
  const { address } = useAccount()
  const config = useConfig()
  const currency = getCurrency(token, chain)

  const posmAddress = POSM_ADDRESS
  const routerAddress = V4_ROUTER_ADDRESS
  const spender = swapping ? routerAddress : posmAddress

  const {
    data: hash,
    writeContractAsync,
    isPending,
    error,
  } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

  if (error) {
    console.error(`ERROR APPROVING ${token.address}: ${error}`)
  }

  const { data: balance } = useBalance({
    address,
    chainId: chain.id,
    token: currency,
    query: { refetchInterval: 200 },
  })

  const { data: permit2Allowance } = useReadContract({
    address: contracts.permit2.address,
    chainId: chain.id,
    abi: permit2Abi,
    functionName: 'allowance',
    query: { enabled: !!token.address, refetchInterval: 200 },
    args: [address!, currency, spender],
  })

  const { data: allowance } = useReadContract({
    abi: erc20Abi,
    chainId: token.nativeChainId ?? chain.id,
    address: token.address,
    functionName: 'allowance',
    args: [
      address!,
      currency !== token.address ? currency : contracts.permit2.address,
    ],
    query: { enabled: !!token.address, refetchInterval: 200 },
  })

  const requiresApproval = (() => {
    // native token
    if (!token.address) return false

    // local token allowance is not enough
    if (!permit2Allowance || permit2Allowance?.[0] < amount) return true

    // ref token but not enough locked (remote approval)
    if (
      currency !== token.address &&
      (!balance?.value || balance.value < amount)
    ) {
      return true
    }

    return false
  })()

  const approve = async () => {
    if (!requiresApproval) return

    if (currency !== token.address) {
      await switchChain(config, { chainId: token.nativeChainId! })

      // globally approve ref token if needed
      if (!allowance || allowance < amount) {
        await writeContractAsync({
          abi: erc20Abi,
          functionName: 'approve',
          address: token.address!,
          args: [currency, MAX_UINT160],
        })
      }

      // remote approval for the spender
      if (!balance?.value || balance.value < amount) {
        const approvalAmount = amount - (balance?.value ?? 0n)
        await writeContractAsync({
          abi: erc20Abi,
          functionName: 'approve',
          address: currency,
          args: [contracts.permit2.address, approvalAmount],
        })
      }

      await switchChain(config, { chainId: chain.id })

      // local Permit2 approval if needed
      if (!permit2Allowance || permit2Allowance?.[0] < amount) {
        await writeContractAsync({
          abi: permit2Abi,
          functionName: 'approve',
          address: contracts.permit2.address,
          args: [currency, spender, MAX_UINT160, Number(MAX_UINT48)],
        })
      }
    } else {
      await switchChain(config, { chainId: chain.id })

      // approve permit2
      if (!allowance || allowance < amount) {
        await writeContractAsync({
          abi: erc20Abi,
          functionName: 'approve',
          address: token.address!,
          args: [contracts.permit2.address, MAX_UINT160],
        })
      }

      // permit2 approve spender
      if (!permit2Allowance || permit2Allowance?.[0] < amount) {
        await writeContractAsync({
          abi: permit2Abi,
          functionName: 'approve',
          address: contracts.permit2.address,
          args: [token.address!, spender, MAX_UINT160, Number(MAX_UINT48)],
        })
      }
    }
  }

  return { approve, requiresApproval, isPending: isPending || isConfirming }
}
