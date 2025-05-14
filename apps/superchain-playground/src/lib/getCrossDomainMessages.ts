import { useQuery } from '@tanstack/react-query'
import { gql, request } from 'graphql-request'
import type { Hex } from 'viem'
import { z } from 'zod'

import { envVars } from '@/envVars'
import { CrossDomainMessageSchema } from '@/lib/IndexerSchema'

// Used for the feed

const getCrossDomainMessagesQuery = gql`
  query MyQuery($) {
    crossDomainMessages(
      orderBy: "lastUpdatedAtBlockTimestamp"
      orderDirection: "desc"
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

export const getCrossDomainMessages = async () => {
  const crossDomainMessages = await request(
    envVars.VITE_CROSS_DOMAIN_MESSENGER_INDEXER_URL,
    getCrossDomainMessagesQuery,
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
    queryFn: () => getCrossDomainMessages(),
    enabled: !!transactionHash,
  })
}
