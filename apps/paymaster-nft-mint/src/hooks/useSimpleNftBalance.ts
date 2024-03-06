import { SimpleNftAbi } from '@/abis/SimpleNftAbi'
import { simpleNftAddress } from '@/constants/addresses'
import { Address } from 'viem'
import { useReadContract } from 'wagmi'

export const useSimpleNftBalance = (address?: Address) => {
  return useReadContract({
    abi: SimpleNftAbi,
    address: simpleNftAddress,
    functionName: 'balanceOf',
    args: [address!],
    query: { enabled: !!address },
  })
}
