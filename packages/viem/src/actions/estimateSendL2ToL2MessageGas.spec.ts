import { encodeFunctionData } from 'viem'
import { describe, expect, it } from 'vitest'

import { supersimL2B } from '@/chains/supersim.js'
import { publicClient, testAccount } from '@/test/clients.js'
import { ticTacToeABI, ticTacToeAddress } from '@/test/setupTicTacToe.js'

describe('estimateSendL2ToL2Message', () => {
  it('should estimate gas', async () => {
    const encodedMessage = encodeFunctionData({
      abi: ticTacToeABI,
      functionName: 'createGame',
      args: [testAccount.address],
    })

    const gas = await publicClient.estimateSendL2ToL2MessageGas({
      account: testAccount.address,
      target: ticTacToeAddress,
      destinationChainId: supersimL2B.id,
      message: encodedMessage,
    })

    expect(gas).toBeDefined()
  })
})
