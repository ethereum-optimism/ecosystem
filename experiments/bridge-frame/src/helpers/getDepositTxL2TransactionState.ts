import type { Hex, TransactionReceipt } from 'viem'
import { getL2TransactionHashes } from 'viem/op-stack'

import type {
  SupportedL1ChainId,
  SupportedL2ChainId,
} from '@/constants/supportedChains'
import type { Env } from '@/env'
import { transactionReceiptStore } from '@/kvModel/transactionReceipt'

export const getDepositTxL2TransactionState = async (
  env: Env,
  {
    l1ChainId,
    l2ChainId,
    l1TransactionHash,
  }: {
    l1ChainId: SupportedL1ChainId
    l2ChainId: SupportedL2ChainId
    l1TransactionHash: Hex
  },
): Promise<{
  l1TransactionReceipt: TransactionReceipt | null
  l2TransactionReceipt: TransactionReceipt | null
}> => {
  const l1TransactionReceipt = await transactionReceiptStore.fetch(env, {
    chainId: l1ChainId,
    transactionHash: l1TransactionHash,
  })

  if (!l1TransactionReceipt) {
    return {
      l1TransactionReceipt: null,
      l2TransactionReceipt: null,
    }
  }

  const l2TransactionHashes = getL2TransactionHashes(l1TransactionReceipt)

  if (l2TransactionHashes.length === 0) {
    throw Error('Not a deposit transaction')
  }

  // Only support one L2 deposit in a single transaction for now
  const l2TransactionHash = l2TransactionHashes[0]

  return {
    l1TransactionReceipt,
    l2TransactionReceipt: await transactionReceiptStore.fetch(env, {
      chainId: l2ChainId,
      transactionHash: l2TransactionHash,
    }),
  }
}
