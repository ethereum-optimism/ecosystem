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
  gasTankAuthorizedMessages,
  gasTankClaimedMessages,
  gasTankGasProviders,
  gasTankPendingWithdrawals,
  gasTankRelayedMessageReceipts,
  relayedMessages,
  sentMessages,
} from 'ponder:schema'
import type { Log } from 'viem'

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
      address: event.args.gasProvider,
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

ponder.on('GasTank:AuthorizedClaims', async ({ event, context }) => {
  for (const messageHash of event.args.messageHashes) {
    await context.db
      .insert(gasTankAuthorizedMessages)
      .values({
        chainId: BigInt(context.network.chainId),
        gasProvider: event.args.gasProvider,
        messageHash,
        authorizedAt: event.block.timestamp,
      })
      .onConflictDoNothing()
  }
})

ponder.on('GasTank:Claimed', async ({ event, context }) => {
  await context.db
    .update(gasTankGasProviders, {
      chainId: BigInt(context.network.chainId),
      address: event.args.gasProvider,
    })
    .set((row) => ({
      balance: row.balance - event.args.claimCost - event.args.relayCost,
      lastUpdatedAt: event.block.timestamp,
    }))

  await context.db.insert(gasTankClaimedMessages).values({
    messageHash: event.args.messageHash,
    chainId: BigInt(context.network.chainId),
    relayer: event.args.relayer,
    claimer: event.args.claimer,
    gasProvider: event.args.gasProvider,
    claimCost: event.args.claimCost,
    relayCost: event.args.relayCost,
    claimedAt: event.block.timestamp,
  })
})

ponder.on('GasTank:RelayedMessageGasReceipt', async ({ event, context }) => {
  const messageIdentifier: MessageIdentifier = {
    origin: event.log.address,
    chainId: BigInt(context.network.chainId),
    logIndex: BigInt(event.log.logIndex),
    blockNumber: event.block.number,
    timestamp: BigInt(event.block.timestamp),
  }

  await context.db.insert(gasTankRelayedMessageReceipts).values({
    messageHash: event.args.messageHash,

    // message fields
    origin: messageIdentifier.origin,
    blockNumber: messageIdentifier.blockNumber,
    logIndex: messageIdentifier.logIndex,
    timestamp: messageIdentifier.timestamp,
    chainId: messageIdentifier.chainId,
    logPayload: encodeMessagePayload({
      ...event.log,
      topics: event.log.topics.filter((topic) => topic !== null),
    } as Log),

    relayer: event.args.relayer,
    relayCost: event.args.relayCost,
    nestedMessageHashes: [...event.args.nestedMessageHashes],
    relayedAt: event.block.timestamp,
  })
})
