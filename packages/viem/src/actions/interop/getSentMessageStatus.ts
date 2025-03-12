import type { Account, Chain, Client, Transport } from 'viem'
import { BaseError } from 'viem'
import { getChainId, readContract } from 'viem/actions'

import { l2ToL2CrossDomainMessengerAbi } from '@/abis.js'
import { contracts } from '@/contracts.js'
import type { CrossDomainMessage } from '@/types/interop/cdm.js'
import { crossDomainMessageHash } from '@/utils/interop/crossDomainMessageHash.js'

/**
 * @category Types
 */
export type GetSentMessageStatusParameters = { message: CrossDomainMessage }

/**
 * @category Types
 */
export type GetSentMessageStatusReturnType = 'ready-to-relay' | 'relayed'

/**
 * @category Types
 */
export type InvalidDestinationChainErrorType = InvalidDestinationChainError & {
  name: 'InvalidDestinationChainError'
}
export class InvalidDestinationChainError extends BaseError {
  constructor(destination: bigint, chainId: bigint) {
    super(`Invalid destination chain: ${destination} !== ${chainId}`)
  }
}

/**
 * Get the status of a cross domain message
 * @category Actions
 * @param client - The client to use
 * @param parameters - {@link GetSentMessageStatusParameters}
 * @returns status -{@link GetSentMessageStatusReturnType}
 * @example
 * import { createPublicClient } from 'viem'
 * import { op, unichain } from '@eth-optimism/viem/chains'
 *
 * const publicClientOp = createPublicClient({ chain: op, transport: http() })
 * const publicClientUnichain = createPublicClient({ chain: unichain, transport: http() })
 *
 * const receipt = await publicClientOp.getTransactionReceipt({ hash: '0x...' })
 * const messages = await getCrossDomainMessages(publicClientOp, { logs: receipt.logs })
 *
 * const message = messages.filter((message) => message.destination === unichain.id)[0]
 * const status = await getSentMessageStatus(publicClientUnichain, { message })
 */
export async function getSentMessageStatus<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
>(
  client: Client<Transport, TChain, TAccount>,
  parameters: GetSentMessageStatusParameters,
): Promise<GetSentMessageStatusReturnType> {
  const { message } = parameters

  const chainId = BigInt(await getChainId(client))
  if (chainId !== message.destination) {
    throw new InvalidDestinationChainError(message.destination, chainId)
  }

  const messageHash = crossDomainMessageHash(message)
  const relayed = await readContract(client, {
    address: contracts.l2ToL2CrossDomainMessenger.address,
    abi: l2ToL2CrossDomainMessengerAbi,
    functionName: 'successfulMessages',
    args: [messageHash],
  })

  return relayed ? 'relayed' : 'ready-to-relay'
}
