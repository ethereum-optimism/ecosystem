import { switchChain } from '@wagmi/core'
import { type Address, type Chain, erc20Abi, zeroAddress } from 'viem'
import {
  useAccount,
  useBalance,
  useConfig,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'

import { getCurrency } from '@/actions/uniswap/getCurrency'
import type { Token } from '@/types/Token'

const MAX_UINT160 = 2n ** 160n - 1n

export const useApproval = ({
  token,
  amount,
  chain,
  spender,
}: {
  token: Token
  amount: bigint
  chain: Chain
  spender: Address
}) => {
  const { address } = useAccount()

  const config = useConfig()
  const currency = getCurrency(token, chain)
  const isRefCurrency = currency !== token.address

  const { data: hash, writeContractAsync, isPending } = useWriteContract()
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash })

  const { data: balance } = useBalance({
    address,
    chainId: chain.id,
    token: currency,
    query: { refetchInterval: 200 },
  })

  const { data: allowance } = useReadContract({
    address: currency,
    chainId: chain.id,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [address ?? zeroAddress, spender],
  })

  const { data: refAllowance } = useReadContract({
    abi: erc20Abi,
    chainId: token.nativeChainId,
    address: token.address,
    functionName: 'allowance',
    args: [address!, currency],
    query: { enabled: isRefCurrency, refetchInterval: 200 },
  })

  const requiresApproval = (() => {
    // native token
    if (!token.address) return false

    // local allowance is not enough
    if (!allowance || allowance < amount) return true

    // ref token but not enough locked (remote approval)
    if (isRefCurrency && (balance?.value ?? 0n) < amount) return true

    return false
  })()

  const approve = async () => {
    if (!requiresApproval) return

    try {
      if (isRefCurrency) {
        // globally approve ref token if needed
        if (!refAllowance || refAllowance < amount) {
          await switchChain(config, { chainId: token.nativeChainId! })
          await writeContractAsync({
            abi: erc20Abi,
            functionName: 'approve',
            address: token.address!,
            args: [currency, MAX_UINT160],
          })
        }

        // remote approval if the balance is insufficient
        if ((balance?.value ?? 0n) < amount) {
          await switchChain(config, { chainId: token.nativeChainId! })

          const approvalAmount = amount - (balance?.value ?? 0n)
          await writeContractAsync({
            abi: erc20Abi,
            functionName: 'approve',
            address: currency,
            args: [spender, approvalAmount],
          })
        }

        await switchChain(config, { chainId: chain.id })
      } else {
        await switchChain(config, { chainId: chain.id })

        // set the local allowance
        if ((allowance ?? 0n) < amount) {
          await writeContractAsync({
            abi: erc20Abi,
            functionName: 'approve',
            address: token.address!,
            args: [spender, MAX_UINT160],
          })
        }
      }
    } catch (error) {
      console.error(`ERROR APPROVING ${token.address}: ${error}`)
    }
  }

  return { approve, requiresApproval, isPending: isPending || isConfirming }
}
