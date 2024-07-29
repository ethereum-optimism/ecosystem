import { toHex } from 'viem'
import { base, optimism } from 'viem/chains'
import { describe, expect, it } from 'vitest'

import { buildSendL2ToL2Message } from '@/actions/buildSendL2ToL2Message.js'
import { publicClient } from '@/test/clients.js'

describe('buildSendL2ToL2Message', () => {
  const expectedChainId = base.id
  const expectedTarget = '0x057ef64E23666F000b34aE31332854aCBd1c8544'
  const expectedMessage = toHex(1, { size: 32 })

  it('should return expected request', async () => {
    const res = await buildSendL2ToL2Message(publicClient, {
      destinationChainId: expectedChainId,
      target: expectedTarget,
      message: expectedMessage,
    })

    expect(res).toEqual({
      account: undefined,
      targetChain: optimism,
      destinationChainId: expectedChainId,
      target: expectedTarget,
      message: expectedMessage,
    })
  })
})
