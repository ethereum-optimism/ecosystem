import { describe, expect, it } from 'vitest'

import { supersimL2B } from '@/chains/supersim.js'
import { publicClientA, testAccount, walletClientA } from '@/test/clients.js'
import { createInteropSentL2ToL2Messages } from '@/utils/l2ToL2CrossDomainMessenger.js'

const AMOUNT_TO_SEND = 10n

describe('crossChainSendETH', () => {
  describe('write contract', () => {
    it('should return expected request', async () => {
      const startingBalance = await publicClientA.getBalance({
        address: testAccount.address,
      })

      const hash = await walletClientA.interop.sendETH({
        to: testAccount.address,
        value: AMOUNT_TO_SEND,
        chainId: supersimL2B.id,
      })

      const receipt = await publicClientA.waitForTransactionReceipt({ hash })

      const { sentMessages } = await createInteropSentL2ToL2Messages(
        publicClientA,
        { receipt },
      )
      expect(sentMessages).toHaveLength(1)

      const gasPaid = receipt.gasUsed * receipt.effectiveGasPrice
      const endingBalance = await publicClientA.getBalance({
        address: testAccount.address,
      })

      expect(endingBalance).toEqual(startingBalance - AMOUNT_TO_SEND - gasPaid)
    })
  })

  describe('estimate gas', () => {
    it('should estimate gas', async () => {
      const gas = await publicClientA.interop.estimateSendETHGas({
        account: testAccount.address,
        to: testAccount.address,
        value: AMOUNT_TO_SEND,
        chainId: supersimL2B.id,
      })

      expect(gas).toBeDefined()
    })
  })

  describe('simulate', () => {
    it('should simulate', async () => {
      expect(() =>
        publicClientA.interop.simulateSendETH({
          account: testAccount.address,
          to: testAccount.address,
          value: AMOUNT_TO_SEND,
          chainId: supersimL2B.id,
        }),
      ).not.throw()
    })
  })
})
