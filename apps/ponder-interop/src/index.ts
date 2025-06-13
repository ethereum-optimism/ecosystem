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
import {
  gasTankClaimedMessages,
  gasTankFlaggedMessages,
  gasTankGasProviders,
  gasTankPendingWithdrawals,
  gasTankRelayedMessageReceipts,
  relayedMessages,
  sentMessages,
} from 'ponder:schema'
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

ponder.on(
  'L2ToL2CDM:RelayedMessage(uint256 indexed source, uint256 indexed messageNonce, bytes32 indexed messageHash)',
  async ({ event, context }) => {
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
  },
)

ponder.on(
  'L2ToL2CDM:RelayedMessage(uint256 indexed source, uint256 indexed messageNonce, bytes32 indexed messageHash, bytes32 returnDataHash)',
  async ({ event, context }) => {
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
  },
)

ponder.on('GasTank:Deposit', async ({ event, context }) => {
  await context.db
    .insert(gasTankGasProviders)
    .values({
      chainId: BigInt(context.network.chainId),
      address: event.args.depositor,
      balance: event.args.amount,
      lastUpdatedAt: event.block.timestamp,
    })
    .onConflictDoUpdate((row) => ({
      balance: row.balance + event.args.amount,
      lastUpdatedAt: event.block.timestamp,
    }))
})

ponder.on('GasTank:WithdrawalInitiated', async ({ event, context }) => {
  await context.db
    .insert(gasTankPendingWithdrawals)
    .values({
      chainId: BigInt(context.network.chainId),
      address: event.args.from,
      amount: event.args.amount,
      initiatedAt: event.block.timestamp,
    })
    .onConflictDoUpdate({
      amount: event.args.amount,
      initiatedAt: event.block.timestamp,
    })
})

ponder.on('GasTank:WithdrawalFinalized', async ({ event, context }) => {
  await context.db.delete(gasTankPendingWithdrawals, {
    chainId: BigInt(context.network.chainId),
    address: event.args.from,
  })

  await context.db
    .update(gasTankGasProviders, {
      chainId: BigInt(context.network.chainId),
      address: event.args.from,
    })
    .set((row) => ({
      balance: row.balance - event.args.amount,
      lastUpdatedAt: event.block.timestamp,
    }))
})

ponder.on('GasTank:Flagged', async ({ event, context }) => {
  await context.db
    .insert(gasTankFlaggedMessages)
    .values({
      chainId: BigInt(context.network.chainId),
      gasProvider: event.args.gasProvider,
      originMessageHash: event.args.originMsgHash,
      flaggedAt: event.block.timestamp,
    })
    .onConflictDoNothing()
})

ponder.on('GasTank:Claimed', async ({ event, context }) => {
  await context.db
    .update(gasTankGasProviders, {
      chainId: BigInt(context.network.chainId),
      address: event.args.gasProvider,
    })
    .set((row) => ({
      balance: row.balance - event.args.amount,
      lastUpdatedAt: event.block.timestamp,
    }))

  await context.db.insert(gasTankClaimedMessages).values({
    originMessageHash: event.args.originMsgHash,
    chainId: BigInt(context.network.chainId),
    relayer: event.args.relayer,
    gasProvider: event.args.gasProvider,
    amountClaimed: event.args.amount,
    claimedAt: event.block.timestamp,
  })
})

ponder.on('GasTank:RelayedMessageGasReceipt', async ({ event, context }) => {
  await context.db.insert(gasTankRelayedMessageReceipts).values({
    originMessageHash: event.args.originMsgHash,
    chainId: BigInt(context.network.chainId),
    relayer: event.args.relayer,
    gasCost: event.args.gasCost,
    destinationMessageHashes: [...event.args.destinationMessageHashes],
    relayedAt: event.block.timestamp,
  })
})
