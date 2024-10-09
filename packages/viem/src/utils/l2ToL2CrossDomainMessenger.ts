import type {
  Account,
  Address,
  Chain,
  Hash,
  Hex,
  Log,
  PublicClient,
  TransactionReceipt,
  Transport,
} from 'viem'
import {
  encodeAbiParameters,
  keccak256,
  parseAbiParameters,
  parseEventLogs,
  toHex,
} from 'viem'

import { l2ToL2CrossDomainMessengerABI } from '@/abis.js'
import type { MessageIdentifier, MessagePayload } from '@/types/interop.js'
import { createInteropMessage } from '@/utils/interop.js'

export type CreateInteropSentL2ToL2MessagesParameters = {
  receipt: TransactionReceipt
}
export type CreateInteropSentL2ToL2MessagesReturnType = {
  sentMessages: Array<{ id: MessageIdentifier; payload: MessagePayload }>
}

export type DecodeSentL2ToL2MessagesParameters = { receipt: TransactionReceipt }
export type DecodeSentL2ToL2MessagesReturnType = {
  messages: Array<{
    destination: bigint
    messageNonce: bigint
    sender: Address
    target: Address
    message: Hex
    log: Log
  }>
}

export type DecodeRelayedL2ToL2MessagesParameters = {
  receipt: TransactionReceipt
}
export type DecodeRelayedL2ToL2MessagesReturnType = {
  successfulMessages: Array<{
    source: bigint
    messageNonce: bigint
    messageHash: Hash
  }>
  failedMessages: Array<{
    source: bigint
    messageNonce: bigint
    messageHash: Hash
  }>
}

/**
 * Utility for creating interoperable messages for the SentMessage event
 * @category Utils
 * @param params {@link CreateInteropL2ToL2SentMessagesParameters}
 * @returns Decoded interop messages {@link CreateInteropSentL2ToL2MessagesReturnType }
 */
export async function createInteropSentL2ToL2Messages<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: PublicClient<Transport, chain, account>,
  params: CreateInteropSentL2ToL2MessagesParameters,
): Promise<CreateInteropSentL2ToL2MessagesReturnType> {
  const selector = keccak256(
    toHex('SentMessage(uint256,address,uint256,address,bytes)'),
  )
  const logs = params.receipt.logs.filter(
    (log) => log.topics.length > 0 || log.topics[0] === selector,
  )
  const messages = await Promise.all(
    logs.map((log) => createInteropMessage(client, { log })),
  )
  return { sentMessages: messages }
}

/**
 * Utility for decoding the sent cross-chain messages through the L2ToL2CrossDomainMessenger
 * @category Utils
 * @param params {@link DecodeSentL2ToL2MessagesParameters}
 * @returns Decoded cross-chain calls {@link DecodeSentL2ToL2MessagesReturnType }
 */
export function decodeSentL2ToL2Messages(
  params: DecodeSentL2ToL2MessagesParameters,
): DecodeSentL2ToL2MessagesReturnType {
  const sentMessages = parseEventLogs({
    abi: l2ToL2CrossDomainMessengerABI,
    eventName: 'SentMessage',
    logs: params.receipt.logs,
  })

  const messages = sentMessages.map((log) => {
    return { ...log.args, log }
  })
  return { messages }
}

/**
 * Utility for decoding relayed successful & failed cross-chain calls through the L2ToL2CrossDomainMessenger
 * @category Utils
 * @param params {@link DecodeRelayedL2ToL2MessagesParameters}
 * @returns Identified relayed messages {@link DecodeRelayedL2ToL2MessagesReturnType }
 */
export function decodeRelayedL2ToL2Messages(
  params: DecodeRelayedL2ToL2MessagesParameters,
): DecodeRelayedL2ToL2MessagesReturnType {
  const RelayedMessageEventName = 'RelayedMessage'
  const FailedRelayedMessageEventName = 'FailedRelayedMessage'
  const relayedMessages = parseEventLogs({
    abi: l2ToL2CrossDomainMessengerABI,
    eventName: [RelayedMessageEventName, FailedRelayedMessageEventName],
    logs: params.receipt.logs,
    strict: true,
  })

  const successfulMessages = relayedMessages.filter(
    (log) => log.eventName === RelayedMessageEventName,
  )
  const failedMessages = relayedMessages.filter(
    (log) => log.eventName === FailedRelayedMessageEventName,
  )
  return {
    successfulMessages: successfulMessages.map((log) => {
      return { ...log.args, log }
    }),
    failedMessages: failedMessages.map((log) => {
      return { ...log.args, log }
    }),
  }
}

/**
 * Utility for constructing the message hash used to identify a cross chain message of the L2ToL2CrossDomianMessenger
 * @category Utils
 */
export function hashL2ToL2Message(
  destination: bigint,
  source: bigint,
  messageNonce: bigint,
  sender: Address,
  target: Address,
  message: Hex,
): Hash {
  return keccak256(
    encodeAbiParameters(
      parseAbiParameters(
        'uint256 _dest, uint256 _src, uint256 _nonce, address _sender, address _target, bytes _msg',
      ),
      [destination, source, messageNonce, sender, target, message],
    ),
  )
}
