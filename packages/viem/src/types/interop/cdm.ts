import type { Address, Hex, Log } from 'viem'

/**
 * The fields that identify an L2 to L2 cross domain message. Together they
 * form the preimage of the message hash.
 */
export type CrossDomainMessageFields = {
  source: bigint
  destination: bigint
  nonce: bigint
  sender: Address
  target: Address
  message: Hex
}

export type CrossDomainMessage = CrossDomainMessageFields & {
  /** Log that was the source of the message */
  log: Log
}
