import type { Address, Hex } from 'viem'

export type TransactionSenderTrackerId = string

export type TransactionSenderTxParams = {
  chainId: number
  to: Address
  data: Hex
}

export type TransactionSenderTxStatus =
  | {
      status: 'pending'
    }
  | {
      status: 'sent'
      hash: Hex
    }
  | {
      status: 'error'
      error: string
    }

export type TransactionSender = {
  sendTransaction: (params: TransactionSenderTxParams) => Promise<{
    trackerId: TransactionSenderTrackerId
    txStatus: TransactionSenderTxStatus
  }>
  getTransactionSendStatus: (
    trackerId: TransactionSenderTrackerId,
  ) => Promise<TransactionSenderTxStatus>
}
