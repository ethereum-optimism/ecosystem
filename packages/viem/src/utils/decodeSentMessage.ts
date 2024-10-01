import type { Address, Hex, Log } from 'viem'
import { parseEventLogs } from 'viem'

import { l2ToL2CrossDomainMessengerABI } from '@/abis.js'

/**
 * @category Types
 */
export type DecodeSentMessageParameters = {
  logs: Log[]
}

/**
 * @category Types
 */
export type DecodeSentMessageReturnType = {
  destination: bigint
  messageNonce: bigint
  sender: Address
  target: Address
  message: Hex
  log: Log
}

/**
 * Utility for decoding SentMessage log events
 * @category Utils
 * @param params {@link DecodeSentMessageParameters}
 * @returns Decoded message arugments {@link DecodeSentMessageReturnType}
 */
export function decodeSentMessage(
  params: DecodeSentMessageParameters,
): DecodeSentMessageReturnType {
  const parsedLogs = parseEventLogs({
    abi: l2ToL2CrossDomainMessengerABI,
    eventName: 'SentMessage',
    logs: params.logs,
  })

  const { destination, target, messageNonce, sender, message } =
    parsedLogs[0].args

  return {
    destination,
    messageNonce,
    sender,
    target,
    message,
    log: parsedLogs[0],
  } as DecodeSentMessageReturnType
}
