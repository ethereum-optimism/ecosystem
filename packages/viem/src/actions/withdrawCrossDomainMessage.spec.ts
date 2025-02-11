import { parseEventLogs } from 'viem'
import { extractWithdrawalMessageLogs } from 'viem/op-stack'
import { describe, expect, it } from 'vitest'

import { crossDomainMessengerAbi } from '@/abis.js'
import {
  estimateWithdrawCrossDomainMessageGas,
  simulateWithdrawCrossDomainMessage,
  withdrawCrossDomainMessage,
} from '@/actions/withdrawCrossDomainMessage.js'
import { publicClientA, testAccount } from '@/test/clients.js'

describe('withdrawCrossDomainMessage', () => {
  describe('write contract', () => {
    it('should return expected result', async () => {
      const hash = await withdrawCrossDomainMessage(publicClientA, {
        account: testAccount,
        target: '0x0000000000000000000000000000000000000000',
        message: '0xabcd',
        value: 10n,
      })

      const { logs } = await publicClientA.waitForTransactionReceipt({ hash })
      const withdrawLog = extractWithdrawalMessageLogs({ logs })
      expect(withdrawLog).toBeDefined()
      expect(withdrawLog!.length).toBe(1)

      const sentMessages = parseEventLogs({
        abi: crossDomainMessengerAbi,
        eventName: 'SentMessage',
        logs,
      })
      expect(sentMessages).toBeDefined()
      expect(sentMessages!.length).toBe(1)
      expect(sentMessages![0].args.message).toBe('0xabcd')
      expect(sentMessages![0].args.sender).toBe(testAccount.address)
      expect(sentMessages![0].args.target).toBe(
        '0x0000000000000000000000000000000000000000',
      )

      const extension = parseEventLogs({
        abi: crossDomainMessengerAbi,
        eventName: 'SentMessageExtension1',
        logs,
      })
      expect(extension).toBeDefined()
      expect(extension!.length).toBe(1)
      expect(extension![0].args.value).toBe(10n)
    })
  })

  describe('estimate gas', () => {
    it('should estimate gas', async () => {
      const gas = await estimateWithdrawCrossDomainMessageGas(publicClientA, {
        account: testAccount,
        target: '0x0000000000000000000000000000000000000000',
        message: '0xabcd',
        value: 10n,
      })

      expect(gas).toBeDefined()
    })
  })

  describe('simulate', () => {
    it('should simulate', async () => {
      expect(
        async () =>
          await simulateWithdrawCrossDomainMessage(publicClientA, {
            account: testAccount,
            target: '0x0000000000000000000000000000000000000000',
            message: '0xabcd',
            value: 10n,
          }),
      ).not.throw()
    })
  })
})
