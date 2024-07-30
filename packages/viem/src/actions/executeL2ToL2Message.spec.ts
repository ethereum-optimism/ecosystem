import { encodeFunctionData, parseEventLogs } from 'viem'
import { base } from 'viem/chains'
import { describe, expect, it } from 'vitest'

import { crossL2InboxABI } from '@/abis.js'
import { buildExecuteL2ToL2Message } from '@/actions/buildExecuteL2ToL2Message.js'
import { executeL2ToL2Message } from '@/actions/executeL2ToL2Message.js'
import { publicClient, testAccount, walletClient } from '@/test/clients.js'
import { ticTacToeABI, ticTacToeAddress } from '@/test/setupTicTacToe.js'
import type { MessageIdentifier } from '@/types/interop.js'

describe('executeL2ToL2Message', () => {
  it('should return expected request', async () => {
    const expectedId = {
      origin: testAccount.address,
      blockNumber: BigInt(100),
      logIndex: BigInt(0),
      timestamp: BigInt(0),
      chainId: BigInt(base.id),
    } as MessageIdentifier

    const args = await buildExecuteL2ToL2Message(publicClient, {
      id: expectedId,
      account: testAccount.address,
      target: ticTacToeAddress,
      message: encodeFunctionData({
        abi: ticTacToeABI,
        functionName: 'createGame',
        args: [testAccount.address],
      }),
    })

    const hash = await executeL2ToL2Message(walletClient, args)

    expect(hash).toBeDefined()

    const receipt = await publicClient.waitForTransactionReceipt({ hash })
    const logs = parseEventLogs({
      abi: crossL2InboxABI,
      logs: receipt.logs,
      eventName: 'ExecutingMessage',
    })
    expect(logs[0].data).toBeDefined()
  })
})
