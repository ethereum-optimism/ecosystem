import type { Hex } from 'viem'
import { encodePacked, keccak256, maxUint32, maxUint64, toHex } from 'viem'

import type { MessageIdentifier } from '@/types/interop/executingMessage.js'

/**
 * Calculates the checksum for a cross chain message following the same logic as CrossL2Inbox.sol
 */
export function calculateChecksum(
  id: MessageIdentifier,
  msgHash: `0x${string}`,
): Hex {
  // Validate size constraints
  if (id.blockNumber > maxUint64) throw new Error('BlockNumberTooHigh')
  if (id.logIndex > maxUint32) throw new Error('LogIndexTooHigh')
  if (id.timestamp > maxUint64) throw new Error('TimestampTooHigh')

  const logHash = keccak256(
    encodePacked(['address', 'bytes32'], [id.origin, msgHash]),
  )

  const idPacked = encodePacked(
    ['uint96', 'uint64', 'uint64', 'uint32'],
    [0n, id.blockNumber, id.timestamp, Number(id.logIndex)],
  )

  const idLogHash = keccak256(
    encodePacked(['bytes32', 'bytes32'], [logHash, idPacked]),
  )

  const bareChecksum = keccak256(
    encodePacked(['bytes32', 'uint256'], [idLogHash, id.chainId]),
  )

  const MSB_MASK =
    '0x00ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
  const TYPE_3_MASK =
    '0x0300000000000000000000000000000000000000000000000000000000000000'
  const checksum =
    (BigInt(bareChecksum) & BigInt(MSB_MASK)) | BigInt(TYPE_3_MASK)

  return toHex(checksum, { size: 32 })
}
