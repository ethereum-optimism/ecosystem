import {
  extractMessageIdentifierFromLogs,
  type MessageIdentifier,
} from '@eth-optimism/viem'
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

  const id = useMemo<Promise<MessageIdentifier | undefined>>(async () => {
    if (!data) {
      return
    }
    return await extractMessageIdentifierFromLogs(
      publicClient as PublicClient,
      { receipt: data },
    )
  }, [data, publicClient])

  return { id }
}
