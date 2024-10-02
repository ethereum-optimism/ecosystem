import { ponder } from '@/generated'
import { encodeAbiParameters, keccak256 } from 'viem'

ponder.on('L2toL2CDM:SentMessage', async ({ event, context }) => {
  const { db, network } = context
  const { XChainMessage } = db
  const { log, block, transaction, args } = event

  const { chainId } = network
  const { logIndex } = log
  const { timestamp, number: blockNumber } = block
  const { hash: txHash } = transaction
  const { destination, target, messageNonce, sender, message } = args
  const msgHash = hashL2toL2CrossDomainMessage(
    destination,
    BigInt(chainId),
    messageNonce,
    sender,
    target,
    message,
  )

  await XChainMessage.create({
    id: msgHash,
    data: {
      chainId: BigInt(chainId),
      txHash,
      logIndex,
      destinationChainId: destination,
      target,
      sender,
      messagePayload: executingMessagePayloadBytes(event.log),
      blockNumber,
      timestamp,
      messageNonce,
      msgHash: msgHash,
      status: 'pending',
    },
  })
})

ponder.on('L2toL2CDM:RelayedMessage', async ({ event, context }) => {
  const { db } = context
  const { XChainMessage } = db
  const { block, transaction } = event
  const { timestamp, number: blockNumber } = block
  const { hash: txHash } = transaction

  const { messageHash } = event.args

  await XChainMessage.update({
    id: messageHash,
    data: {
      status: 'relayed',
      destinationTxHash: txHash,
      destinationTimestamp: timestamp,
      destinationBlockNumber: blockNumber,
    },
  })
})

ponder.on('L2toL2CDM:FailedRelayedMessage', async ({ event, context }) => {
  const { db } = context
  const { XChainMessage } = db

  const { messageHash } = event.args

  await XChainMessage.update({
    id: messageHash,
    data: {
      status: 'failed',
      failedTxHash: event.transaction.hash,
    },
  })
})

function executingMessagePayloadBytes(log: {
  topics: string[]
  data: string
}): `0x${string}` {
  let msg = ''

  // Concatenate each topic (removing the "0x" prefix from each)
  for (const topic of log.topics) {
    msg += topic.startsWith('0x') ? topic.slice(2) : topic
  }

  // Concatenate log.data (removing the "0x" prefix if it exists)
  const logData = log.data.startsWith('0x') ? log.data.slice(2) : log.data

  // Return the concatenated result prefixed with "0x"
  return ('0x' + msg + logData) as `0x${string}`
}

function hashL2toL2CrossDomainMessage(
  destination: bigint,
  source: bigint,
  nonce: bigint,
  sender: `0x${string}`,
  target: `0x${string}`,
  message: `0x${string}`,
) {
  // Encoding the parameters as per ABI specification
  const encodedData = encodeAbiParameters(
    [
      { name: '_destination', type: 'uint256' },
      { name: '_source', type: 'uint256' },
      { name: '_nonce', type: 'uint256' },
      { name: '_sender', type: 'address' },
      { name: '_target', type: 'address' },
      { name: '_message', type: 'bytes' },
    ],
    [destination, source, nonce, sender, target, message],
  )

  // Hash the encoded data using keccak256
  const hash = keccak256(encodedData)

  return hash
}
