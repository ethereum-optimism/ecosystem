import { ponder } from '@/generated'
import { getAddress, toHex } from 'viem'

const NULL_ADDRESS = toHex(0, { size: 20 })

ponder.on('optimist:Transfer', async ({ event, context }) => {
  const { Optimist } = context.db

  const { chainId } = context.network
  const { hash: transactionHash, blockNumber } = event.transaction
  const { from, to, tokenId } = event.args

  if (from === NULL_ADDRESS) {
    await Optimist.create({
      id: to,
      data: {
        chainId,
        tokenId,
        transactionHash,
        blockNumber,
      },
    })
  } else if (to === NULL_ADDRESS) {
    await Optimist.delete({ id: from })
  }
})
