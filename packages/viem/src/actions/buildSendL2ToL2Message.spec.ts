import { encodeFunctionData } from 'viem'
import { base, optimism } from 'viem/chains'
import { describe, expect, it } from 'vitest'

import { buildSendL2ToL2Message } from '@/actions/buildSendL2ToL2Message.js'
import { publicClient, testAccount } from '@/test/clients.js'
import { ticTacToeABI, ticTacToeAddress } from '@/test/setupTicTacToe.js'

describe('buildSendL2ToL2Message', () => {
  const expectedChainId = base.id
  const expectedTarget = ticTacToeAddress
  const expectedMessage = encodeFunctionData({
    abi: ticTacToeABI,
    functionName: 'createGame',
    args: [testAccount.address],
  })

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
