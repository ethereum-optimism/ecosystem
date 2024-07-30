import { encodeFunctionData } from 'viem'
import { base, optimism } from 'viem/chains'
import { describe, expect, it } from 'vitest'

import { buildSendL2ToL2Message } from '@/actions/buildSendL2ToL2Message.js'
import { sendL2ToL2Message } from '@/actions/sendL2ToL2Message.js'
import { publicClient, testAccount, walletClient } from '@/test/clients.js'
import { ticTacToeABI, ticTacToeAddress } from '@/test/setupTicTacToe.js'
import { extractMessageIdentifierFromLogs } from '@/utils/extractMessageIdentifierFromLogs.js'

describe('sendL2ToL2Message', () => {
  it('should return expected request', async () => {
    const args = await buildSendL2ToL2Message(publicClient, {
      account: testAccount.address,
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
    const id = await extractMessageIdentifierFromLogs(publicClient, { receipt })

    expect(id).toBeDefined()
    expect(id.chainId).toEqual(BigInt(optimism.id))
    expect(id.origin.toLowerCase()).toEqual(testAccount.address.toLowerCase())
    expect(id.blockNumber).toEqual(receipt.blockNumber)
    expect(id.logIndex).toEqual(BigInt(receipt.logs[0].logIndex))
  })
})
