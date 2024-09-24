import { encodeFunctionData, keccak256, parseEventLogs } from 'viem'
import { describe, expect, it } from 'vitest'

import { crossL2InboxABI } from '@/abis.js'
import { supersimL2A } from '@/chains/supersim.js'
import { publicClient, testAccount, walletClient } from '@/test/clients.js'
import { ticTacToeABI, ticTacToeAddress } from '@/test/setupTicTacToe.js'
import type { MessageIdentifier } from '@/types/interop.js'

describe('executeL2ToL2Message', () => {
  const expectedId = {
    origin: walletClient.account.address,
    blockNumber: BigInt(100),
    logIndex: BigInt(0),
    timestamp: BigInt(1),
    chainId: BigInt(supersimL2A.id),
  } as MessageIdentifier

  const encodedMessage = encodeFunctionData({
    abi: ticTacToeABI,
    functionName: 'createGame',
    args: [testAccount.address],
  })

  describe('estimate gas', async () => {
    it('should estimate gas', async () => {
      const gas = await publicClient.estimateExecuteL2ToL2MessageGas({
        account: testAccount.address,
        id: expectedId,
        target: ticTacToeAddress,
        message: encodedMessage,
      })

      expect(gas).toBeDefined()
    })
  })

  describe('write contract', () => {
    it('should return expected request', async () => {
      const hash = await walletClient.executeL2ToL2Message({
        id: expectedId,
        account: testAccount.address,
        target: ticTacToeAddress,
        message: encodedMessage,
      })

      expect(hash).toBeDefined()

      const receipt = await publicClient.waitForTransactionReceipt({ hash })

      const logs = parseEventLogs({
        abi: crossL2InboxABI,
        logs: receipt.logs,
        eventName: 'ExecutingMessage',
      })

      const { msgHash } = logs[0].args
      expect(msgHash).toEqual(keccak256(encodedMessage))
    })
  })

  describe('simulate', () => {
    it('should simulate', async () => {
      expect(() =>
        publicClient.simulateExecuteL2ToL2Message({
          id: expectedId,
          account: testAccount.address,
          target: ticTacToeAddress,
          message: encodedMessage,
        }),
      ).not.throw()
    })
  })
})
