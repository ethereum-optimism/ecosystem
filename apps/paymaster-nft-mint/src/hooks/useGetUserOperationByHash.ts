import { useQuery } from '@tanstack/react-query'
import { Hex } from 'viem'
import { useBundlerClient } from '@/hooks/useBundlerClient'

export const useGetUserOperationByHash = (userOperationHash?: Hex) => {
  const bundlerClient = useBundlerClient()
  return useQuery({
    queryKey: ['userOperation', bundlerClient.chain?.id, userOperationHash],
    queryFn: async () => {
      return await bundlerClient.getUserOperationByHash({
        hash: userOperationHash!,
      })
    },
    enabled: !!userOperationHash,
    staleTime: 60 * 60 * 1000,
  })
}
