import { contracts } from '@eth-optimism/viem'
import {
  relayCrossDomainMessage,
  simulateRelayCrossDomainMessage,
} from '@eth-optimism/viem/actions/interop'
import type { MessageIdentifier } from '@eth-optimism/viem/types/interop'
import { encodeAccessList } from '@eth-optimism/viem/utils/interop'
import type { Logger } from 'pino'
import { isHash, isHex } from 'viem'
import { z } from 'zod'

import type { Config } from '@/config/config.js'
import { jsonFetchParams } from '@/utils/jsonFetchParams.js'

const pendingMessagesSchema = z.array(
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

type PendingMessages = z.infer<typeof pendingMessagesSchema>

/**
 * Relay messages listed as pending
 * @param log - The logger.
 * @param config - The config {@link Config}.
 */
export async function relayPendingMessages(log: Logger, config: Config) {
  let pendingMessages: PendingMessages

  // fetch pending messages
  try {
    const url = `${config.apiUrl}/messages/pending`
    const resp = await fetch(url, jsonFetchParams)
    if (!resp.ok) {
      const error = resp.statusText
      log.error({ error }, 'invalid api response')
      return
    }

    const body = await resp.json()
    const result = pendingMessagesSchema.safeParse(body)
    if (!result.success) {
      const error = result.error.format()
      log.error({ error }, 'failed parsing api response')
      return
    }

    pendingMessages = result.data
  } catch (error) {
    log.error({ error }, 'failed to pending messages fetch')
    return
  }

  log.info(`${pendingMessages.length} pending messages`)
  for (const message of pendingMessages) {
    const msgLog = log.child({
      source: message.source,
      destination: message.destination,
      messageHash: message.messageHash,
      txHash: message.transactionHash,
    })

    if (!config.clients[message.destination]) {
      msgLog.warn('no client for destination, skipping...')
      continue
    }

    const client = config.clients[message.destination]
    const submissionClient = config.submissionClients[message.destination]

    // If no account is configured (sponsored), specify
    // a random account owned by the sponsored endpoint.
    let account = submissionClient.account
    if (!account) {
      const accounts = await submissionClient.getAddresses()
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

    // submit (skip local gas estimation)
    const relayTxHash = await relayCrossDomainMessage(submissionClient, {
      ...params,
      gas: null,
    })
    msgLog.info({ relayTxHash }, 'submitted message relay')
  }
}
