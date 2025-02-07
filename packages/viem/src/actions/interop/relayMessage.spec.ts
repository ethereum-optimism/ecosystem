import { encodeFunctionData } from 'viem'
import { describe, expect, it } from 'vitest'

import { supersimL2A, supersimL2B } from '@/chains/supersim.js'
import {
  publicClientA,
  publicClientB,
  testAccount,
  walletClientA,
  walletClientB,
} from '@/test/clients.js'
import { ticTacToeAbi, ticTacToeAddress } from '@/test/setupTicTacToe.js'
import {
  createInteropSentL2ToL2Messages,
  decodeRelayedL2ToL2Messages,
  decodeSentL2ToL2Messages,
  hashL2ToL2Message,
} from '@/utils/l2ToL2CrossDomainMessenger.js'

describe('relayMessage', () => {
  const calldata = encodeFunctionData({
    abi: ticTacToeAbi,
    functionName: 'createGame',
    args: [testAccount.address],
  })

  describe('estimate gas', () => {
    it('should estimate gas', async () => {
      const hash = await walletClientA.interop.sendMessage({
        account: testAccount.address,
        destinationChainId: supersimL2B.id,
        target: ticTacToeAddress,
        message: calldata,
      })

      const receipt = await publicClientA.waitForTransactionReceipt({ hash })
      const { sentMessages } = await createInteropSentL2ToL2Messages(
        publicClientA,
        {
          receipt,
        },
      )
      expect(sentMessages).length(1)

      const gas = await publicClientB.interop.estimateRelayMessageGas({
        account: testAccount.address,
        sentMessageId: sentMessages[0].id,
        sentMessagePayload: sentMessages[0].payload,
      })

      expect(gas).toBeDefined()
    })
  })

  describe('simulate', () => {
    it('should simulate', async () => {
      const hash = await walletClientA.interop.sendMessage({
        account: testAccount.address,
        destinationChainId: supersimL2B.id,
        target: ticTacToeAddress,
        message: calldata,
      })

      const receipt = await publicClientA.waitForTransactionReceipt({ hash })
      const { sentMessages } = await createInteropSentL2ToL2Messages(
        publicClientA,
        {
          receipt,
        },
      )
      expect(sentMessages).length(1)

      expect(() =>
        publicClientB.interop.simulateRelayMessage({
          account: testAccount,
          sentMessageId: sentMessages[0].id,
          sentMessagePayload: sentMessages[0].payload,
        }),
      ).not.throw()
    })
  })

  describe('write contract', () => {
    it('should return expected request', async () => {
      const sendTxHash = await walletClientA.interop.sendMessage({
        account: testAccount.address,
        destinationChainId: supersimL2B.id,
        target: ticTacToeAddress,
        message: calldata,
      })

      const sendReceipt = await publicClientA.waitForTransactionReceipt({
        hash: sendTxHash,
      })
      const { sentMessages } = await createInteropSentL2ToL2Messages(
        publicClientA,
        {
          receipt: sendReceipt,
        },
      )
      expect(sentMessages).length(1)

      const relayTxHash = await walletClientB.interop.relayMessage({
        sentMessageId: sentMessages[0].id,
        sentMessagePayload: sentMessages[0].payload,
      })

      expect(relayTxHash).toBeDefined()

      // succesfully relayed
      const relayReceipt = await publicClientB.waitForTransactionReceipt({
        hash: relayTxHash,
      })
      const { successfulMessages } = decodeRelayedL2ToL2Messages({
        receipt: relayReceipt,
      })
      expect(successfulMessages).length(1)

      // CDM messageHash check
      const { messages } = decodeSentL2ToL2Messages({ receipt: sendReceipt })
      expect(messages).length(1)

      const { destination, messageNonce, sender, target, message } = messages[0]
      const msgHash = hashL2ToL2Message(
        destination,
        BigInt(supersimL2A.id),
        messageNonce,
        sender,
        target,
        message,
      )
      expect(msgHash).toEqual(successfulMessages[0].messageHash)
    })
  })
})
