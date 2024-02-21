import { zeroAddress } from 'viem'

import type { IndexingFunctionArgs } from '@/generated'
import { ponder } from '@/generated'

export async function transfer(
  args: IndexingFunctionArgs<'optimist:Transfer'>,
) {
  const { event, context } = args

  const { Optimist } = context.db

  const { chainId } = context.network
  const { hash: transactionHash, blockNumber } = event.transaction
  const { from, to, tokenId } = event.args

  if (from === zeroAddress) {
    await Optimist.upsert({
      id: to,
      create: {
        chainId,
        tokenId,
        transactionHash,
        blockNumber,
      },
      update: {},
    })
  } else if (to === zeroAddress) {
    await Optimist.delete({ id: from })
  }
}

export function registerOptimistEvents() {
  ponder.on('optimist:Transfer', transfer)
}
