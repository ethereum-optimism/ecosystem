import { encodeFunctionData } from 'viem'
import { base } from 'viem/chains'
import { describe, expect, it } from 'vitest'

import { publicClient, testAccount, walletClient } from '@/test/clients.js'
import { ticTacToeABI, ticTacToeAddress } from '@/test/setupTicTacToe.js'
import type { MessageIdentifier } from '@/types/interop.js'

describe('estimateExecuteL2ToL2Message', () => {
  it('should estimate gas', async () => {
    const expectedId = {
      origin: walletClient.account.address,
      blockNumber: BigInt(100),
      logIndex: BigInt(0),
      timestamp: BigInt(0),
      chainId: BigInt(base.id),
    } as MessageIdentifier

    const encodedMessage = encodeFunctionData({
      abi: ticTacToeABI,
      functionName: 'createGame',
      args: [testAccount.address],
    })

    const gas = await publicClient.estimateExecuteL2ToL2MessageGas({
      account: testAccount.address,
      id: expectedId,
      target: ticTacToeAddress,
      message: encodedMessage,
    })

    expect(gas).toBeDefined()
  })
})
