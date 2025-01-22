import { beforeAll, describe, expect, it } from 'vitest'

import { superchainWETHAbi } from '@/abis.js'
import { contracts } from '@/contracts.js'
import { publicClientA, testAccount, walletClientA } from '@/test/clients.js'
import { SUPERSIM_SUPERC20_ADDRESS } from '@/test/supERC20.js'

const AMOUNT_TO_WITHDRAW = 10n

describe('withdrawSuperchainWETH', () => {
  beforeAll(async () => {
    const hash = await walletClientA.interop.depositSuperchainWETH({
      value: 1000n,
    })

    await publicClientA.waitForTransactionReceipt({ hash })
  })

  describe('write contract', () => {
    it('should return expected request', async () => {
      const startingSuperchainWETHBalance = await publicClientA.readContract({
        address: contracts.superchainWETH.address,
        abi: superchainWETHAbi,
        functionName: 'balanceOf',
        args: [testAccount.address],
      })
      const startingETHBalance = await publicClientA.getBalance({
        address: testAccount.address,
      })

      const hash = await walletClientA.interop.withdrawSuperchainWETH({
        amount: AMOUNT_TO_WITHDRAW,
      })
      const receipt = await publicClientA.waitForTransactionReceipt({ hash })

      const endingSuperchainWETHBalance = await publicClientA.readContract({
        address: contracts.superchainWETH.address,
        abi: superchainWETHAbi,
        functionName: 'balanceOf',
        args: [testAccount.address],
      })
      const endingETHBalance = await publicClientA.getBalance({
        address: testAccount.address,
      })

      expect(endingSuperchainWETHBalance).toEqual(
        startingSuperchainWETHBalance - AMOUNT_TO_WITHDRAW,
      )
      const gasPaid = receipt.gasUsed * receipt.effectiveGasPrice
      expect(endingETHBalance).toEqual(
        startingETHBalance + AMOUNT_TO_WITHDRAW - gasPaid,
      )
    })
  })

  describe('estimate gas', () => {
    it('should estimate gas', async () => {
      const gas = await publicClientA.interop.estimateWithdrawSuperchainWETHGas(
        {
          account: testAccount.address,
          amount: AMOUNT_TO_WITHDRAW,
        },
      )

      expect(gas).toBeDefined()
    })
  })

  describe('simulate', () => {
    it('should simulate', async () => {
      expect(() =>
        publicClientA.interop.simulateWithdrawSuperchainWETH({
          account: testAccount.address,
          amount: AMOUNT_TO_WITHDRAW,
        }),
      ).not.throw()
    })
  })
})
