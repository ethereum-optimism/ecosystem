import type { Account, Chain, Client, Transport } from 'viem'
import { BaseError } from 'viem'
import { getChainId, readContract } from 'viem/actions'

import { l2ToL2CrossDomainMessengerAbi } from '@/abis/index.js'
import { interopContracts } from '@/contracts.js'
import type { CrossDomainMessageFields } from '@/types/interop/cdm.js'
import { hashCrossDomainMessage } from '@/utils/interop/hashCrossDomainMessage.js'

/**
 * @category Types
 */
export type GetCrossDomainMessageExpiryParameters = {
  /** Message sent from the chain the client is connected to. */
  message: CrossDomainMessageFields
}

/**
 * @category Types
 */
export type GetCrossDomainMessageExpiryReturnType = {
  /** Hash of the message, as computed by the `L2ToL2CrossDomainMessenger`. */
  messageHash: `0x${string}`
  /**
   * `true` once the source chain has marked the message expired
   * (`expiredMessages(messageHash)`). An expired message can never be relayed,
   * and the sending application can undo the send.
   */
  expired: boolean
  /**
   * Source chain timestamp at which the message was sent
   * (`sentMessageTimestamps(messageHash)`). `0n` when the messenger did not
   * record it, for example for a message sent before OP Stack Upgrade 22
   * (Lagoon). Such a message can never expire.
   */
  sentAt: bigint
  /** The messenger's `expiryPeriod()`, 691200 seconds (8 days) on production networks. */
  expiryPeriod: bigint
  /**
   * The message can be marked expired only by an export
   * ({@link exportUndeliveredMessage}) made on the destination chain at a
   * block timestamp strictly greater than this value (`sentAt + expiryPeriod`).
   * `null` when `sentAt` is `0n`.
   */
  exportableAfter: bigint | null
}

/**
 * @category Types
 */
export type InvalidSourceChainErrorType = InvalidSourceChainError & {
  name: 'InvalidSourceChainError'
}
export class InvalidSourceChainError extends BaseError {
  constructor(source: bigint, chainId: bigint) {
    super(`Invalid source chain: ${source} !== ${chainId}`)
  }
}

/**
 * Get the expiry state of a cross domain message on its source chain.
 *
 * Interop messages that are not relayed within the expiry window can never be
 * relayed. Once the message is exported as undelivered from its destination
 * chain (see {@link exportUndeliveredMessage}) and that withdrawal is finalized
 * on L1, the source chain's `L2ToL2CrossDomainMessenger` marks it expired and
 * emits `MessageExpired`. Applications then undo the send, as
 * `SuperchainETHBridge.refundETH` does (see {@link refundETH}).
 * @category Actions
 * @param client - Client connected to the message's source chain
 * @param parameters - {@link GetCrossDomainMessageExpiryParameters}
 * @returns expiry state - {@link GetCrossDomainMessageExpiryReturnType}
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { op } from '@eth-optimism/viem/chains'
 * import { getCrossDomainMessages, getCrossDomainMessageExpiry } from '@eth-optimism/viem/actions/interop'
 *
 * const publicClientOp = createPublicClient({ chain: op, transport: http() })
 * const receipt = await publicClientOp.getTransactionReceipt({ hash: '0x...' })
 * const [message] = await getCrossDomainMessages(publicClientOp, { logs: receipt.logs })
 *
 * const { expired } = await getCrossDomainMessageExpiry(publicClientOp, { message })
 */
export async function getCrossDomainMessageExpiry<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
>(
  client: Client<Transport, TChain, TAccount>,
  parameters: GetCrossDomainMessageExpiryParameters,
): Promise<GetCrossDomainMessageExpiryReturnType> {
  const { message } = parameters

  const chainId = BigInt(await getChainId(client))
  if (chainId !== message.source) {
    throw new InvalidSourceChainError(message.source, chainId)
  }

  const messageHash = hashCrossDomainMessage(message)
  const contract = {
    address: interopContracts.l2ToL2CrossDomainMessenger.address,
    abi: l2ToL2CrossDomainMessengerAbi,
  } as const

  const [expired, sentAt, expiryPeriod] = await Promise.all([
    readContract(client, {
      ...contract,
      functionName: 'expiredMessages',
      args: [messageHash],
    }),
    readContract(client, {
      ...contract,
      functionName: 'sentMessageTimestamps',
      args: [messageHash],
    }),
    readContract(client, { ...contract, functionName: 'expiryPeriod' }),
  ])

  return {
    messageHash,
    expired,
    sentAt,
    expiryPeriod,
    exportableAfter: sentAt === 0n ? null : sentAt + expiryPeriod,
  }
}
