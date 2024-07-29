import { encodeFunctionData, parseEventLogs } from 'viem'
import { base } from 'viem/chains'
import { describe, expect, it } from 'vitest'

import { l2ToL2CrossDomainMessengerABI } from '@/abis.js'
import { buildSendL2ToL2Message } from '@/actions/buildSendL2ToL2Message.js'
import { sendL2ToL2Message } from '@/actions/sendL2ToL2Message.js'
import { publicClient, testAccount, walletClient } from '@/test/clients.js'
import { ticTacToeABI, ticTacToeAddress } from '@/test/setupTicTacToe.js'

describe('sendL2ToL2Message', () => {
  it('should return expected request', async () => {
    const args = await buildSendL2ToL2Message(publicClient, {
      destinationChainId: base.id,
      target: ticTacToeAddress,
      message: encodeFunctionData({
        abi: ticTacToeABI,
        functionName: 'createGame',
        args: [testAccount.address],
      }),
    })

    const hash = await sendL2ToL2Message(walletClient, args)
    expect(hash).toBeDefined()

    const receipt = await publicClient.waitForTransactionReceipt({ hash })
    const logs = parseEventLogs({
      abi: l2ToL2CrossDomainMessengerABI,
      logs: receipt.logs,
      eventName: 'SentMessage',
    })
    expect(logs[0].data).toBeDefined()
  })
})
