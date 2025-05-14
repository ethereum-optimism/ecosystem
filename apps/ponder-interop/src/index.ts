import { contracts } from '@eth-optimism/viem'
import type {
  CrossDomainMessage,
  MessageIdentifier,
} from '@eth-optimism/viem/types/interop'
import {
  encodeMessagePayload,
  hashCrossDomainMessage,
} from '@eth-optimism/viem/utils/interop'
import { ponder } from 'ponder:registry'
import { relayedMessages, sentMessages } from 'ponder:schema'
import { type Log } from 'viem'

import { hashMessageIdentifier } from '@/utils/hashMessageIdentifier.js'

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

  const messageIdentifier: MessageIdentifier = {
    origin: contracts.l2ToL2CrossDomainMessenger.address,
    chainId: cdm.source,
    logIndex: BigInt(event.log.logIndex),
    blockNumber: event.block.number,
    timestamp: BigInt(event.block.timestamp),
  }

  await context.db.insert(sentMessages).values({
    messageIdentifierHash: hashMessageIdentifier(messageIdentifier),

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
    txOrigin: event.transaction.from,
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
