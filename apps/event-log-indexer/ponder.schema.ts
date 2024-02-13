import { createSchema } from '@ponder/core'

export default createSchema((p) => ({
  Optimist: p.createTable({
    id: p.hex(),
    chainId: p.int(),
    tokenId: p.bigint(),
    transactionHash: p.hex(),
    blockNumber: p.bigint(),
  }),
}))
