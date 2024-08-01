import type {
  Account,
  Chain,
  Hex,
  PublicClient,
  TransactionReceipt,
  Transport,
} from 'viem'
import { BaseError, parseEventLogs } from 'viem'

import { l2ToL2CrossDomainMessengerABI } from '@/abis.js'
import type { MessageIdentifier } from '@/types/interop.js'
import type { ErrorType } from '@/types/utils.js'

export type ExtractMessageIdentifierFromLogsParameters = {
  /**
   * The receipt for the sendL2ToL2Message transaction.
   */
  receipt: TransactionReceipt
}

export type ExtractMessageIdentifierFromLogsReturnType = MessageIdentifier

export type ExtractMessageIdentifierFromLogsErrorType =
  | ErrorType
  | ReceiptContainsMessageIdentifierError

export class ReceiptContainsMessageIdentifierError extends BaseError {
  override name = 'ReceiptContainsMessageIdentifierError'
  constructor({ hash }: { hash: Hex }) {
    super(
      `The provided transaction receipt with hash "${hash}" contains no message identifier.`,
    )
  }
}

/**
 * Retrieves a message identifier from the logs returned with the receipt from the sendL2ToL2Message transaction.
 *
 * - Docs: TODO add markdown docs
 * @param client - Client to use
 * @param parameters - {@link GetGameParameters}
 * @returns A valid message identifier. {@link GetGameReturnType}
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet, optimism } from 'viem/chains'
 * import { extractMessageIdentifierFromLogs } from 'viem/op-stack'
 *
 * const publicClientL1 = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 *
 * const id = await extractMessageIdentifierFromLogs(publicClientL1, {
 *   receipt: ...
 * })
 */
export async function extractMessageIdentifierFromLogs<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: PublicClient<Transport, chain, account>,
  parameters: ExtractMessageIdentifierFromLogsParameters,
): Promise<ExtractMessageIdentifierFromLogsReturnType> {
  const { receipt } = parameters

  const sentMessageLogs = parseEventLogs({
    abi: l2ToL2CrossDomainMessengerABI,
    logs: receipt.logs,
    eventName: 'SentMessage',
  })

  const log = sentMessageLogs[0]
  if (!log) {
    throw new ReceiptContainsMessageIdentifierError({
      hash: receipt.transactionHash,
    })
  }

  const block = await client.getBlock({ blockHash: log.blockHash })

  const id = {
    origin: receipt.from,
    blockNumber: log.blockNumber,
    logIndex: BigInt(log.logIndex),
    timestamp: block.timestamp,
    chainId: BigInt(client.chain?.id as number),
  } as MessageIdentifier

  return id
}
