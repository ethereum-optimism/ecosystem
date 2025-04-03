import type { CrossDomainMessage } from '@eth-optimism/viem/types/interop'
import {
  encodeMessagePayload,
  hashCrossDomainMessage,
} from '@eth-optimism/viem/utils/interop'
import { ponder } from 'ponder:registry'
import { relayedMessages, sentMessages } from 'ponder:schema'
import type { Log } from 'viem'

ponder.on('L2ToL2CDM:SentMessage', async ({ event, context }) => {
  const cdm = {
    source: BigInt(context.network.chainId),
    destination: event.args.destination,
    nonce: event.args.messageNonce,
    sender: event.args.sender,
    target: event.args.target,
    message: event.args.message,
    log: event.log as Log,
  } satisfies CrossDomainMessage

  await context.db.insert(sentMessages).values({
    messageHash: hashCrossDomainMessage(cdm),

    // message
    source: cdm.source,
    destination: cdm.destination,
    nonce: cdm.nonce,
    sender: cdm.sender,
    target: cdm.target,
    message: cdm.message,

    // log fields
    logIndex: BigInt(event.log.logIndex),
    logPayload: encodeMessagePayload(event.log as Log),

    // general info
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transaction.hash,
  })
})

ponder.on('L2ToL2CDM:RelayedMessage', async ({ event, context }) => {
  await context.db.insert(relayedMessages).values({
    messageHash: event.args.messageHash,

    // metadata
    relayer: event.transaction.from,

    // log fields
    logIndex: BigInt(event.log.logIndex),
    logPayload: encodeMessagePayload(event.log as Log),

    // general info
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    transactionHash: event.transaction.hash,
  })
})
