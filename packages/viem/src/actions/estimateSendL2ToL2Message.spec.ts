import { toHex } from 'viem'
import { describe, expect, it } from 'vitest'

import { estimateSendL2ToL2MessageGas } from '@/actions/estimateSendL2ToL2Message'
import { publicClient } from '@/test/clients'

describe('estimateSendL2ToL2Message', () => {
  it('should estimate gas', async () => {
    const gas = await estimateSendL2ToL2MessageGas(publicClient, {
      account: '0x057ef64E23666F000b34aE31332854aCBd1c8544',
      target: '0x057ef64E23666F000b34aE31332854aCBd1c8544',
      destinationChainId: 100,
      message: toHex(1, { size: 32 }),
    })
    expect(gas).toBeDefined()
  })
})
