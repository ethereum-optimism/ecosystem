import { toHex } from 'viem'

import type { IndexingFunctionArgs } from '@/generated'
import { ponder } from '@/generated'

export const NULL_ADDRESS = toHex(0, { size: 20 })

export async function transfer(
  args: IndexingFunctionArgs<'optimist:Transfer'>,
) {
  const { event, context } = args

  const { Optimist } = context.db

  const { chainId } = context.network
  const { hash: transactionHash, blockNumber } = event.transaction
  const { from, to, tokenId } = event.args

  if (from === NULL_ADDRESS) {
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
  } else if (to === NULL_ADDRESS) {
    await Optimist.delete({ id: from })
  }
}

export function registerOptimstEvents() {
  ponder.on('optimist:Transfer', transfer)
}
