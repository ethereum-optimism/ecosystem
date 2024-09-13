import { encodeFunctionData } from 'viem'
import { describe, expect, it } from 'vitest'

import { supersimL2A } from '@/chains/supersim.js'
import { publicClient, testAccount } from '@/test/clients.js'
import { ticTacToeABI, ticTacToeAddress } from '@/test/setupTicTacToe.js'
import type { MessageIdentifier } from '@/types/interop.js'

describe('buildExecuteL2ToL2Message', () => {
  const expectedId = {
    origin: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    blockNumber: BigInt(100),
    logIndex: BigInt(0),
    timestamp: BigInt(0),
    chainId: BigInt(supersimL2A.id),
  } as MessageIdentifier

  const expectedTarget = ticTacToeAddress
  const expectedMessage = encodeFunctionData({
    abi: ticTacToeABI,
    functionName: 'createGame',
    args: [testAccount.address],
  })

  it('should return expected request', async () => {
    const res = await publicClient.buildExecuteL2ToL2Message({
      id: expectedId,
      target: expectedTarget,
      message: expectedMessage,
    })

    expect(res).toEqual({
      account: undefined,
      targetChain: supersimL2A,
      id: expectedId,
      target: expectedTarget,
      message: expectedMessage,
    })
  })
})
