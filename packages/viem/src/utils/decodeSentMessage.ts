import type { Address, Hex } from 'viem'
import { decodeFunctionData } from 'viem'

import { l2ToL2CrossDomainMessengerABI } from '@/abis.js'

export type DecodeSentMessageParameters = {
  payload: Hex
}

export type DecodeSentMessageReturnType = {
  origin: bigint
  destination: bigint
  messageNonce: bigint
  sender: Address
  target: Address
  message: Hex
}

export function decodeSentMessage(
  params: DecodeSentMessageParameters,
): DecodeSentMessageReturnType {
  const decodedPayload = decodeFunctionData({
    abi: l2ToL2CrossDomainMessengerABI,
    data: params.payload,
  })

  const [destination, origin, messageNonce, sender, target, message] =
    decodedPayload.args

  return {
    origin,
    destination,
    messageNonce,
    sender,
    target,
    message,
  } as DecodeSentMessageReturnType
}
