import { encodeFunctionData } from 'viem'
import { describe, expect, it } from 'vitest'

import { supersimL2A } from '@/chains/supersim.js'
import { publicClient, testAccount } from '@/test/clients.js'
import { ticTacToeABI, ticTacToeAddress } from '@/test/setupTicTacToe.js'

describe('buildSendL2ToL2Message', () => {
  const expectedChainId = supersimL2A.id
  const expectedTarget = ticTacToeAddress
  const expectedMessage = encodeFunctionData({
    abi: ticTacToeABI,
    functionName: 'createGame',
    args: [testAccount.address],
  })

  it('should return expected request', async () => {
    const res = await publicClient.buildSendL2ToL2Message({
      destinationChainId: expectedChainId,
      target: expectedTarget,
      message: expectedMessage,
    })

    expect(res).toEqual({
      account: undefined,
      targetChain: supersimL2A,
      destinationChainId: expectedChainId,
      target: expectedTarget,
      message: expectedMessage,
    })
  })
})
