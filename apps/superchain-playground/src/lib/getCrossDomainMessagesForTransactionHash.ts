import { useQuery } from '@tanstack/react-query'
import { gql, request } from 'graphql-request'
import type { Hex } from 'viem'
import { z } from 'zod'

import { envVars } from '@/envVars'
import { CrossDomainMessageSchema } from '@/lib/IndexerSchema'

const getCrossDomainMessagesByTransactionHashQuery = gql`
  query MyQuery($transactionHash: String) {
    crossDomainMessages(
      orderBy: "lastUpdatedAtBlockTimestamp"
      orderDirection: "desc"
      where: { transactionHashes_has: $transactionHash }
    ) {
      gasLimit
      id
      value
      msgHash
      transactionHashes
      status
      lastUpdatedAtBlockTimestamp
      message
      messageNonce
      opStackChain {
        id
        l1ChainId
        l2ChainId
      }
      sender
      sourceChainId
      target
      targetChainId
    }
  }
`

const CrossDomainMessageSubsetSchema = CrossDomainMessageSchema.omit({
  sentMessageEvent: true,
  sentMessageExtension1Event: true,
  relayedMessageEvent: true,
  failedRelayedMessageEvent: true,
})

const querySchema = z.object({
  crossDomainMessages: z.array(CrossDomainMessageSubsetSchema),
})

export type CrossDomainMessageSubset = z.infer<
  typeof CrossDomainMessageSubsetSchema
>

export const getCrossDomainMessagesForTransactionHash = async (
  transactionHash: Hex,
) => {
  const crossDomainMessages = await request(
    envVars.VITE_CROSS_DOMAIN_MESSENGER_INDEXER_URL,
    getCrossDomainMessagesByTransactionHashQuery,
    {
      transactionHash,
    },
  )
    .then(querySchema.parse)
    .then((data) => data.crossDomainMessages)

  return crossDomainMessages
}

export const getCrossDomainMessagesForTransactionHashQueryKey = (
  transactionHash?: Hex,
) =>
  transactionHash
    ? ['CrossDomainMessagesForTransactionHash', transactionHash]
    : []

export const useCrossDomainMessagesForTransactionHash = (
  transactionHash?: Hex,
) => {
  return useQuery({
    queryKey: getCrossDomainMessagesForTransactionHashQueryKey(transactionHash),
    queryFn: () => getCrossDomainMessagesForTransactionHash(transactionHash!),
    enabled: !!transactionHash,
  })
}
