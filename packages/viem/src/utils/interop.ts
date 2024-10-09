import type {
  Account,
  Chain,
  Hash,
  Log,
  PublicClient,
  TransactionReceipt,
  Transport,
} from 'viem'
import { concat, parseEventLogs } from 'viem'

import { crossL2InboxABI } from '@/abis.js'
import type { MessageIdentifier, MessagePayload } from '@/types/interop.js'

export type CreateInteropMessageParameters = { log: Log }
export type CreateInteropMessageReturnType = {
  id: MessageIdentifier
  payload: MessagePayload
}

export type DecodeExecutingMessagesParameters = { receipt: TransactionReceipt }
export type DecodeExecutingMessagesReturnType = {
  executingMessages: Array<{ id: MessageIdentifier; msgHash: Hash; log: Log }>
}

/**
 * Utility for creating an interoperable {@link MessageIdentifier} & {@link MessagePayload} from a log
 * @category Utils
 * @param params {@link CreateInteropMessageParameters}
 * @returns created interop message {@link Message}
 */
export async function createInteropMessage<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: PublicClient<Transport, chain, account>,
  params: CreateInteropMessageParameters,
): Promise<CreateInteropMessageReturnType> {
  const { log } = params
  if (log.blockNumber === undefined || log.logIndex === undefined) {
    throw new Error('pending log cannot be constructed into an interop message')
  }
  if (!client.chain) {
    throw new Error('define chain required to construct an interop message')
  }

  const block = await client.getBlock({ blockHash: log.blockHash as Hash })
  const id: MessageIdentifier = {
    origin: log.address,
    logIndex: BigInt(log.logIndex!),
    blockNumber: block.number,
    timestamp: block.timestamp,
    chainId: BigInt(client.chain.id),
  }

  const payload = concat([...params.log.topics, params.log.data])
  return { id, payload }
}

/**
 * Utility for decoding interoperable messages (logs) that were validated by the CrossL2Inbox
 * @category Utils
 * @param params {@link DecodeExecutingMessagesParameters}
 * @returns Decoded cross-chain calls {@link DecodeExecutingMessagesReturnType }
 */
export function decodeExecutingMessages(
  params: DecodeExecutingMessagesParameters,
): DecodeExecutingMessagesReturnType {
  const logs = parseEventLogs({
    abi: crossL2InboxABI,
    eventName: 'ExecutingMessage',
    logs: params.receipt.logs,
  })

  const executingMessages = logs.map((log) => {
    return { ...log.args, log }
  })
  return { executingMessages }
}
