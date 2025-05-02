import { contracts } from '@eth-optimism/viem'
import {
  relayCrossDomainMessage,
  simulateRelayCrossDomainMessage,
} from '@eth-optimism/viem/actions/interop'
import type { MessageIdentifier } from '@eth-optimism/viem/types/interop'
import { encodeAccessList } from '@eth-optimism/viem/utils/interop'
import type { Logger } from 'pino'
import type { PublicClient, WalletClient } from 'viem'
import { isHash, isHex } from 'viem'
import { z } from 'zod'

import { jsonFetchParams } from '@/utils/jsonFetchParams.js'

const PendingMessagesSchema = z.array(
  z.object({
    // Identifier
    messageHash: z.string().refine(isHex, 'invalid message hash'),
    // Message Direction
    source: z.number(),
    destination: z.number(),
    // ExecutingMessage
    logIndex: z.number(),
    logPayload: z.string().refine(isHex, 'invalid log payload'),
    timestamp: z.number(),
    blockNumber: z.number(),
    transactionHash: z.string().refine(isHash, 'invalid transaction hash'),
  }),
)

type PendingMessages = z.infer<typeof PendingMessagesSchema>

interface RelayerConfig {
  ponderInteropApi: string
  clients: Record<number, PublicClient>
  walletClients: Record<number, WalletClient>
}

export class Relayer {
  private readonly config: RelayerConfig
  private readonly log: Logger

  constructor(log: Logger, config: RelayerConfig) {
    this.config = config
    this.log = log.child({ module: 'relayer' })
  }

  async run(): Promise<void> {
    const pendingMessages = await this.__fetchPendingMessages()
    this.log.info(`${pendingMessages.length} pending messages`)

    for (const message of pendingMessages) {
      const msgLog = this.log.child({
        source: message.source,
        destination: message.destination,
        messageHash: message.messageHash,
        txHash: message.transactionHash,
      })

      if (
        !this.config.clients[message.destination] ||
        !this.config.walletClients[message.destination]
      ) {
        msgLog.warn('no client for destination, skipping...')
        continue
      }

      const client = this.config.clients[message.destination]
      const walletClient = this.config.walletClients[message.destination]

      // If no account is configured (sponsored), specify
      // a random account owned by the sponsored endpoint.
      let account = walletClient.account
      if (!account) {
        const accounts = await walletClient.getAddresses()
        if (accounts.length === 0) {
          msgLog.warn('no accounts found, skipping...')
          continue
        }

        const randomIndex = Math.floor(Math.random() * accounts.length)
        account = { address: accounts[randomIndex], type: 'json-rpc' }
      }

      // build the executing message params
      const id: MessageIdentifier = {
        origin: contracts.l2ToL2CrossDomainMessenger.address,
        chainId: BigInt(message.source),
        logIndex: BigInt(message.logIndex),
        blockNumber: BigInt(message.blockNumber),
        timestamp: BigInt(message.timestamp),
      }
      const payload = message.logPayload
      const accessList = encodeAccessList(id, payload)

      const params = { id, payload, accessList, account, chain: null }

      // simulate
      try {
        await simulateRelayCrossDomainMessage(client, params)
      } catch (error) {
        msgLog.warn({ error }, 'failed simulation, skipping...')
        continue
      }

      // submit (skip local gas estimation if sponsored)
      const gas = !walletClient.account ? null : undefined
      const relayTxHash = await relayCrossDomainMessage(walletClient, {
        ...params,
        gas,
      })
      msgLog.info({ relayTxHash }, 'submitted message relay')
    }
  }

  private async __fetchPendingMessages(): Promise<PendingMessages> {
    try {
      const url = `${this.config.ponderInteropApi}/messages/pending`
      const resp = await fetch(url, jsonFetchParams)
      if (!resp.ok) {
        throw new Error(`invalid http response: ${resp.statusText}`)
      }

      const body = await resp.json()
      const { data: msgs, error } = PendingMessagesSchema.safeParse(body)
      if (error) {
        throw new Error(`parsing api response: ${error.format()}`)
      }

      return msgs
    } catch (error) {
      throw new Error(`failed pending messages fetch: ${error}`)
    }
  }
}
