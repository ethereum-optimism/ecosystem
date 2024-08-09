import type { Account, Chain, Hex, Transport, WalletClient } from 'viem'
import { z } from 'zod'

import type {
  TransactionSender,
  TransactionSenderTrackerId,
  TransactionSenderTxParams,
} from '@/transaction-sender/TransactionSender'
import { hexSchema } from '@/utils/hexSchema'

const DOMAIN = 'WALLET_TX'

const getTrackerId = (txHash: Hex) => {
  return [DOMAIN, txHash].join(':')
}

const trackerIdSchema = z
  .string()
  .transform((val) => {
    const [domain, txHash] = val.split(':')
    return {
      domain,
      txHash,
    }
  })
  .pipe(
    z.object({
      domain: z.literal(DOMAIN),
      txHash: hexSchema,
    }),
  )

export const createWalletTransactionSender = (
  adminWalletClient: WalletClient<Transport, Chain, Account>,
): TransactionSender => {
  return {
    sendTransaction: async (txParams: TransactionSenderTxParams) => {
      if (txParams.chainId !== adminWalletClient.chain.id) {
        throw new Error('Invalid chainId')
      }

      const hash = await adminWalletClient.sendTransaction({
        to: txParams.to,
        data: txParams.data,
        value: 0n,
      })

      return {
        trackerId: getTrackerId(hash),
        txStatus: {
          status: 'sent',
          hash,
        },
      }
    },
    getTransactionSendStatus: async (trackerId: TransactionSenderTrackerId) => {
      const parseResult = trackerIdSchema.safeParse(trackerId)
      if (!parseResult.success) {
        throw new Error('Invalid trackerId')
      }
      return {
        status: 'sent',
        hash: parseResult.data.txHash,
      }
    },
  }
}
