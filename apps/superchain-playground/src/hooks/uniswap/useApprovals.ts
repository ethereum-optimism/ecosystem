import { contracts } from '@eth-optimism/viem'
import { switchChain } from '@wagmi/core'
import { type Chain, type ChainContract, erc20Abi } from 'viem'
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
import type { Token } from '@/types/Token'

const MAX_UINT160 = 2n ** 160n - 1n
const MAX_UINT48 = 2n ** 48n - 1n

export const useApproval = ({
  token,
  amount,
  chain,
}: {
  token: Token
  amount: bigint
  chain: Chain
}) => {
  const { address } = useAccount()
  const config = useConfig()
  const currency = getCurrency(token, chain)

  const permit2Address = contracts.permit2.address
  const posmAddress = (chain.contracts?.uniV4Posm as ChainContract).address

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
    address: permit2Address,
    chainId: chain.id,
    abi: permit2Abi,
    functionName: 'allowance',
    query: { enabled: !!token.address, refetchInterval: 200 },
    args: [address!, currency, posmAddress],
  })

  const { data: allowance } = useReadContract({
    abi: erc20Abi,
    chainId: token.nativeChainId ?? chain.id,
    address: token.address,
    functionName: 'allowance',
    args: [address!, currency !== token.address ? currency : permit2Address],
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

      // remote approval for the posm
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
          address: permit2Address,
          args: [currency, posmAddress, MAX_UINT160, Number(MAX_UINT48)],
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
          args: [permit2Address, MAX_UINT160],
        })
      }

      // permit2 approve POSM
      if (!permit2Allowance || permit2Allowance?.[0] < amount) {
        await writeContractAsync({
          abi: permit2Abi,
          functionName: 'approve',
          address: permit2Address,
          args: [token.address!, posmAddress, MAX_UINT160, Number(MAX_UINT48)],
        })
      }
    }
  }

  return { approve, requiresApproval, isPending: isPending || isConfirming }
}
