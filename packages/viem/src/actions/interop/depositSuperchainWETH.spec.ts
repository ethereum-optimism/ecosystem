import { describe, expect, it } from 'vitest'

import { superchainWETHAbi } from '@/abis.js'
import { contracts } from '@/contracts.js'
import { publicClientA, testAccount, walletClientA } from '@/test/clients.js'

const AMOUNT_TO_SEND = 10n

describe('depositSuperchainWETH', () => {
  describe('write contract', () => {
    it('should return expected request', async () => {
      const startingBalance = await publicClientA.readContract({
        address: contracts.superchainWETH.address,
        abi: superchainWETHAbi,
        functionName: 'balanceOf',
        args: [testAccount.address],
      })

      const hash = await walletClientA.interop.depositSuperchainWETH({
        value: AMOUNT_TO_SEND,
      })

      await publicClientA.waitForTransactionReceipt({ hash })

      const endingBalance = await publicClientA.readContract({
        address: contracts.superchainWETH.address,
        abi: superchainWETHAbi,
        functionName: 'balanceOf',
        args: [testAccount.address],
      })

      expect(endingBalance).toEqual(startingBalance + AMOUNT_TO_SEND)
    })
  })

  describe('estimate gas', () => {
    it('should estimate gas', async () => {
      const gas = await publicClientA.interop.estimateDepositSuperchainWETHGas({
        account: testAccount.address,
        value: AMOUNT_TO_SEND,
      })

      expect(gas).toBeDefined()
    })
  })

  describe('simulate', () => {
    it('should simulate', async () => {
      expect(() =>
        publicClientA.interop.simulateDepositSuperchainWETH({
          account: testAccount.address,
          value: AMOUNT_TO_SEND,
        }),
      ).not.throw()
    })
  })
})
