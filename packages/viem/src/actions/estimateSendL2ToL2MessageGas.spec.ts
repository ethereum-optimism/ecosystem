import { encodeFunctionData } from 'viem'
import { base } from 'viem/chains'
import { describe, expect, it } from 'vitest'

import { estimateSendL2ToL2MessageGas } from '@/actions/estimateSendL2ToL2MessageGas.js'
import { publicClient, testAccount } from '@/test/clients.js'
import { ticTacToeABI, ticTacToeAddress } from '@/test/setupTicTacToe.js'

describe('estimateSendL2ToL2Message', () => {
  it('should estimate gas', async () => {
    const encodedMessage = encodeFunctionData({
      abi: ticTacToeABI,
      functionName: 'createGame',
      args: [testAccount.address],
    })

    const gas = await estimateSendL2ToL2MessageGas(publicClient, {
      account: testAccount.address,
      target: ticTacToeAddress,
      destinationChainId: base.id,
      message: encodedMessage,
    })

    expect(gas).toBeDefined()
  })
})
