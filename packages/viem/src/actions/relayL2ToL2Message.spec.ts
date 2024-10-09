import { encodeFunctionData } from 'viem'
import { describe, expect, it } from 'vitest'

import { supersimL2B } from '@/chains/supersim.js'
import { publicClientA, publicClientB, testAccount, walletClientA, walletClientB } from '@/test/clients.js'
import { ticTacToeABI, ticTacToeAddress } from '@/test/setupTicTacToe.js'
import { createInteropSentL2ToL2Messages, decodeRelayedL2ToL2Messages } from '@/utils/l2ToL2CrossDomainMessenger.js'

describe('relayL2ToL2Message', () => {
  const calldata = encodeFunctionData({
    abi: ticTacToeABI,
    functionName: 'createGame',
    args: [testAccount.address],
  })

  describe('estimate gas', async () => {
    const hash = await walletClientA.sendL2ToL2Message({
      account: testAccount.address,
      destinationChainId: supersimL2B.id,
      target: ticTacToeAddress,
      message: calldata,
    })

    const receipt = await publicClientA.waitForTransactionReceipt({ hash })
    const { sentMessages } = await createInteropSentL2ToL2Messages(publicClientA, { receipt })
    const sentMessage = sentMessages[0]

    it('should estimate gas', async () => {
      const gas = await publicClientB.estimateRelayL2ToL2MessageGas({
        account: testAccount.address,
        sentMessageId: sentMessage.id,
        sentMessagePayload: sentMessage.payload,
      })

      expect(gas).toBeDefined()
    })
  })


  describe('simulate', async () => {
    const hash = await walletClientA.sendL2ToL2Message({
      account: testAccount.address,
      destinationChainId: supersimL2B.id,
      target: ticTacToeAddress,
      message: calldata,
    })

    const receipt = await publicClientA.waitForTransactionReceipt({ hash })
    const { sentMessages } = await createInteropSentL2ToL2Messages(publicClientA, { receipt })
    const sentMessage = sentMessages[0]

    it('should simulate', async () => {
      expect(() =>
        publicClientB.simulateRelayL2ToL2Message({
          account: testAccount,
          sentMessageId: sentMessage.id,
          sentMessagePayload: sentMessage.payload
        }),
      ).not.throw()
    })
  })

  describe('write contract', async () => {
    const hash = await walletClientA.sendL2ToL2Message({
      account: testAccount.address,
      destinationChainId: supersimL2B.id,
      target: ticTacToeAddress,
      message: calldata,
    })

    const receipt = await publicClientA.waitForTransactionReceipt({ hash })
    const { sentMessages } = await createInteropSentL2ToL2Messages(publicClientA, { receipt })
    const sentMessage = sentMessages[0]

    it('should return expected request', async () => {
      const hash = await walletClientB.relayL2ToL2Message({
        sentMessageId: sentMessage.id,
        sentMessagePayload: sentMessage.payload
      })

      expect(hash).toBeDefined()
      const receipt = await publicClientB.waitForTransactionReceipt({ hash })
      const { successfulMessages, failedMessages } = decodeRelayedL2ToL2Messages({ receipt })
      expect(successfulMessages).length(1)
      expect(failedMessages).length(0)
    })
  })
})
