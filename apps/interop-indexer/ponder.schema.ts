import { createSchema } from '@ponder/core'

export default createSchema((p) => ({
  MessageStatus: p.createEnum(['pending', 'failed', 'relayed']),
  XChainMessage: p.createTable(
    {
      id: p.string(),
      txHash: p.hex(),
      destinationChainId: p.bigint(),
      target: p.hex(),
      sender: p.hex(),
      chainId: p.bigint(),
      messagePayload: p.hex(),
      messageNonce: p.bigint(),
      blockNumber: p.bigint(),
      logIndex: p.int(),
      timestamp: p.bigint(),
      msgHash: p.hex(),
      status: p.enum('MessageStatus'),
      destinationTxHash: p.hex().optional(),
      destinationTimestamp: p.bigint().optional(),
      destinationBlockNumber: p.bigint().optional(),
      failedTxHash: p.hex().optional(),
    },
    {
      msgHashIndex: p.index('msgHash'),
    },
  ),
}))
