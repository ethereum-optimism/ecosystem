import { switchChain } from '@wagmi/core'
import { type Address, erc20Abi, zeroAddress } from 'viem'
import {
  useBalance,
  useConfig,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'

import { permit2Abi } from '@/constants/permit2Abi'
import { PERMIT2_ADDRESS, POSM_ADDRESS } from '@/hooks/uniswap/addresses'

interface Token {
  symbol: string
  name: string
  decimals: number
  address?: Address

  nativeChainId?: number
  refAddress?: Address
}

const MAX_UINT160 = 2n ** 160n - 1n
const MAX_UINT48 = 2n ** 48n - 1n

export const useApproval = ({
  token,
  amount,
  owner,
}: {
  token: Token
  amount: bigint
  owner: Address
}) => {
  const config = useConfig()
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
    address: owner,
    chainId: 901,
    token: token.refAddress ?? token.address ?? zeroAddress,
    query: { enabled: !!owner },
  })

  const { data: localPermit2Allowance } = useReadContract({
    address: PERMIT2_ADDRESS,
    chainId: 901,
    abi: permit2Abi,
    functionName: 'allowance',
    query: { enabled: !!token.address },
    args: [
      owner,
      token.refAddress ?? token.address ?? zeroAddress,
      POSM_ADDRESS,
    ],
  })

  const { data: remoteRefAllowance } = useReadContract({
    abi: erc20Abi,
    address: token.address,
    chainId: token.refAddress ? 902 : 901,
    functionName: 'allowance',
    args: [owner, token.refAddress ?? PERMIT2_ADDRESS],
    query: { enabled: !!token.address },
  })

  const requiresApproval = (() => {
    // native token
    if (!token.refAddress && !token.address) return false

    // local token allowance is not enough
    if (!localPermit2Allowance || localPermit2Allowance?.[0] < amount)
      return true

    // ref token but not enough locked (remote approval)
    if (token.refAddress && (!balance?.value || balance.value < amount))
      return true

    return false
  })()

  const approve = async () => {
    if (!requiresApproval) return

    if (token.refAddress) {
      await switchChain(config, { chainId: 902 })

      // globally approve ref token if needed
      if (!remoteRefAllowance || remoteRefAllowance < amount) {
        await writeContractAsync({
          abi: erc20Abi,
          functionName: 'approve',
          address: token.address!,
          args: [token.refAddress, MAX_UINT160],
        })
      }

      // remote approval for the posm
      if (!balance?.value || balance.value < amount) {
        await writeContractAsync({
          abi: erc20Abi,
          functionName: 'approve',
          address: token.refAddress,
          args: [
            POSM_ADDRESS,
            !balance?.value ? amount : amount - balance.value,
          ],
        })
      }

      await switchChain(config, { chainId: 901 })

      // local Permit2 approval if needed
      if (!localPermit2Allowance || localPermit2Allowance?.[0] < amount) {
        await writeContractAsync({
          abi: permit2Abi,
          functionName: 'approve',
          address: PERMIT2_ADDRESS,
          args: [
            token.refAddress,
            POSM_ADDRESS,
            MAX_UINT160,
            Number(MAX_UINT48),
          ],
        })
      }
    } else {
      await switchChain(config, { chainId: 901 })

      // approve permit2
      if (!remoteRefAllowance || remoteRefAllowance < amount) {
        await writeContractAsync({
          abi: erc20Abi,
          functionName: 'approve',
          address: token.address!,
          args: [PERMIT2_ADDRESS, MAX_UINT160],
        })
      }

      // permit2 approve POSM
      if (!localPermit2Allowance || localPermit2Allowance?.[0] < amount) {
        await writeContractAsync({
          abi: permit2Abi,
          functionName: 'approve',
          address: PERMIT2_ADDRESS,
          args: [token.address!, POSM_ADDRESS, MAX_UINT160, Number(MAX_UINT48)],
        })
      }
    }
  }

  return { approve, requiresApproval, isPending: isPending || isConfirming }
}
