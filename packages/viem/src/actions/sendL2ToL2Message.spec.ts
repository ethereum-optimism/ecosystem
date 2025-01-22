import { encodeFunctionData } from 'viem'
import { describe, expect, it } from 'vitest'

import { supersimL2B } from '@/chains/supersim.js'
import { publicClientA, testAccount, walletClientA } from '@/test/clients.js'
import { ticTacToeAbi, ticTacToeAddress } from '@/test/setupTicTacToe.js'
import { decodeSentL2ToL2Messages } from '@/utils/l2ToL2CrossDomainMessenger.js'

describe('sendL2ToL2Message', () => {
  const calldata = encodeFunctionData({
    abi: ticTacToeAbi,
    functionName: 'createGame',
    args: [testAccount.address],
  })

  describe('write contract', () => {
    it('should return expected request', async () => {
      const txHash = await walletClientA.interop.sendL2ToL2Message({
        account: testAccount.address,
        destinationChainId: supersimL2B.id,
        target: ticTacToeAddress,
        message: calldata,
      })

      expect(txHash).toBeDefined()

      // SentMessage event
      const receipt = await publicClientA.waitForTransactionReceipt({
        hash: txHash,
      })
      const { messages } = decodeSentL2ToL2Messages({ receipt })
      expect(messages).length(1)

      // very cross chain msg
      const { destination, sender, target, message } = messages[0]
      expect(destination).toEqual(BigInt(supersimL2B.id))
      expect(sender).toEqual(testAccount.address)
      expect(target).toEqual(ticTacToeAddress)
      expect(message).toEqual(calldata)
    })
  })

  describe('estimate gas', () => {
    it('should estimate gas', async () => {
      const gas = await publicClientA.interop.estimateSendL2ToL2MessageGas({
        account: testAccount.address,
        target: ticTacToeAddress,
        destinationChainId: supersimL2B.id,
        message: calldata,
      })

      expect(gas).toBeDefined()
    })
  })

  describe('simulate', () => {
    it('should simulate', async () => {
      expect(() =>
        publicClientA.interop.simulateSendL2ToL2Message({
          account: testAccount.address,
          destinationChainId: supersimL2B.id,
          target: ticTacToeAddress,
          message: calldata,
        }),
      ).not.throw()
    })
  })
})
