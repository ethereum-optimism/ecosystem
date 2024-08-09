import { sepolia } from 'viem/chains'
import { z } from 'zod'

import type { GelatoRelay } from '@/transaction-sender/gelato/GelatoRelay'
import type {
  TransactionSender,
  TransactionSenderTrackerId,
  TransactionSenderTxParams,
} from '@/transaction-sender/TransactionSender'

const DOMAIN = 'GELATO_RELAY_SPONSOR_CALL'

const getTrackerId = (taskId: string) => {
  return [DOMAIN, taskId].join(':')
}

const trackerIdSchema = z
  .string()
  .transform((val) => {
    const [domain, taskId] = val.split(':')
    return {
      domain,
      taskId,
    }
  })
  .pipe(
    z.object({
      domain: z.literal(DOMAIN),
      taskId: z.string(),
    }),
  )

export const createGelatoTransactionSender = (
  gelatoRelay: GelatoRelay,
): TransactionSender => {
  return {
    sendTransaction: async (txParams: TransactionSenderTxParams) => {
      if (txParams.chainId !== sepolia.id) {
        throw new Error('Invalid chainId')
      }

      const result = await gelatoRelay.sendSponsoredCall(txParams)

      return {
        trackerId: getTrackerId(result.taskId),
        txStatus: {
          status: 'pending',
        },
      }
    },
    getTransactionSendStatus: async (trackerId: TransactionSenderTrackerId) => {
      const parseResult = trackerIdSchema.safeParse(trackerId)
      if (!parseResult.success) {
        throw new Error('Invalid trackerId')
      }

      const taskId = parseResult.data.taskId

      const result = await gelatoRelay.getTaskStatus({ taskId })

      const task = result.task

      if (!task.transactionHash) {
        return {
          status: 'pending',
        }
      }

      return {
        status: 'pending',
        hash: task.transactionHash,
      }
    },
  }
}
