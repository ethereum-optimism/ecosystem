import type { CrossDomainMessage } from '@eth-optimism/viem/types/interop'
import {
  encodeMessagePayload,
  hashCrossDomainMessage,
} from '@eth-optimism/viem/utils/interop'
import type { Virtual } from 'ponder'
import type { Log } from 'viem'

import type { createInteropSchema } from './createInteropSchema.js'
import type { createPonderConfig } from './createPonderConfig.js'

type schema = ReturnType<typeof createInteropSchema>

export class PonderInterop<TSchema extends schema> {
  private ponderDep: Virtual.Registry<
    ReturnType<typeof createPonderConfig>,
    TSchema
  >
  private schema: TSchema

  constructor(
    ponderDep: Virtual.Registry<ReturnType<typeof createPonderConfig>, TSchema>,
    schema: TSchema,
  ) {
    this.ponderDep = ponderDep
    this.schema = schema
    this.initializeEventHandlers()
  }

  private initializeEventHandlers() {
    this.ponderDep.on('L2ToL2CDM:SentMessage', async ({ event, context }) => {
      const cdm = {
        source: BigInt(context.network.chainId),
        destination: event.args.destination,
        nonce: event.args.messageNonce,
        sender: event.args.sender,
        target: event.args.target,
        message: event.args.message,
        log: event.log as Log,
      } satisfies CrossDomainMessage

      // Store in DB
      await context.db.insert(this.schema.sentMessages).values({
        messageHash: hashCrossDomainMessage(cdm),
        source: cdm.source,
        destination: cdm.destination,
        nonce: cdm.nonce,
        sender: cdm.sender,
        target: cdm.target,
        message: cdm.message,
        logIndex: BigInt(event.log.logIndex),
        logPayload: encodeMessagePayload(event.log as Log),
        timestamp: event.block.timestamp,
        blockNumber: event.block.number,
        transactionHash: event.transaction.hash,
      })
    })

    this.ponderDep.on(
      'L2ToL2CDM:RelayedMessage',
      async ({ event, context }) => {
        await context.db.insert(this.schema.relayedMessages).values({
          messageHash: event.args.messageHash,
          relayer: event.transaction.from,
          logIndex: BigInt(event.log.logIndex),
          logPayload: encodeMessagePayload(event.log as Log),
          timestamp: event.block.timestamp,
          blockNumber: event.block.number,
          transactionHash: event.transaction.hash,
        })
      },
    )
  }
}
