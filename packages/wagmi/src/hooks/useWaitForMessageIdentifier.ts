import type { ExtractMessageIdentifierFromLogsReturnType } from '@eth-optimism/viem'
import { extractMessageIdentifierFromLogs } from '@eth-optimism/viem'
import { useMemo } from 'react'
import type { Hash, PublicClient } from 'viem'
import { useConfig, usePublicClient, useWaitForTransactionReceipt } from 'wagmi'

export type WaitForMessageIdentifierParams = {
  hash: Hash
}

export const useWaitForMessageIdentifier = ({
  hash,
}: WaitForMessageIdentifierParams) => {
  const config = useConfig()
  const publicClient = usePublicClient({ config })
  const { data } = useWaitForTransactionReceipt({ config, hash })

  const message = useMemo<
    Promise<ExtractMessageIdentifierFromLogsReturnType | undefined>
  >(async () => {
    if (!data) {
      return
    }
    return await extractMessageIdentifierFromLogs(
      publicClient as PublicClient,
      { receipt: data },
    )
  }, [data, publicClient])

  return message
}
