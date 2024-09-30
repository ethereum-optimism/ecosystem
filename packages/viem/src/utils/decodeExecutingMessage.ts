import type { Hash, Log } from 'viem'
import { parseEventLogs } from 'viem'

import { crossL2InboxABI } from '@/abis.js'
import type { MessageIdentifier } from '@/types/interop.js'

export type DecodeExecutingMessageParameters = {
  logs: Log[]
}

export type DecodeExecutingMessageReturnType = {
  msgHash: Hash
  id: MessageIdentifier
}

export function decodeExecutingMessage(
  params: DecodeExecutingMessageParameters,
) {
  const parsedLogs = parseEventLogs({
    abi: crossL2InboxABI,
    logs: params.logs,
    eventName: 'ExecutingMessage',
  })

  const { msgHash, id } = parsedLogs[0].args

  return {
    id,
    msgHash,
  } as DecodeExecutingMessageReturnType
}
