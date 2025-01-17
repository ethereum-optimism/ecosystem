import { parseAbi, erc20Abi } from 'viem'
import { beforeAll, describe, expect, it } from 'vitest'

import { supersimL2B } from '@/chains/supersim.js'
import { publicClientA, testAccount, walletClientA } from '@/test/clients.js'
import { SUPERSIM_SUPERC20_ADDRESS } from '@/test/supERC20.js'
import { createInteropSentL2ToL2Messages } from '@/utils/l2ToL2CrossDomainMessenger.js'

const AMOUNT_TO_SEND = 10n

describe('sendSuperchainERC20', () => {
  beforeAll(async () => {
    const hash = await walletClientA.writeContract({
      address: SUPERSIM_SUPERC20_ADDRESS,
      abi: parseAbi(['function mint(address to, uint256 amount)']),
      functionName: 'mint',
      args: [testAccount.address, 1000n],
    })

    await publicClientA.waitForTransactionReceipt({ hash })
  })

  describe('write contract', () => {
    it('should return expected request', async () => {
      const startingBalance = await publicClientA.readContract({
        address: SUPERSIM_SUPERC20_ADDRESS,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [testAccount.address],
      })

      const hash = await walletClientA.sendSuperchainERC20({
        tokenAddress: SUPERSIM_SUPERC20_ADDRESS,
        to: testAccount.address,
        amount: AMOUNT_TO_SEND,
        chainId: supersimL2B.id,
      })

      const receipt = await publicClientA.waitForTransactionReceipt({ hash })

      const { sentMessages } = await createInteropSentL2ToL2Messages(
        publicClientA,
        { receipt },
      )
      expect(sentMessages).toHaveLength(1)

      const endingBalance = await publicClientA.readContract({
        address: SUPERSIM_SUPERC20_ADDRESS,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [testAccount.address],
      })

      expect(endingBalance).toEqual(startingBalance - AMOUNT_TO_SEND)
    })
  })

  describe('estimate gas', () => {
    it('should estimate gas', async () => {
      const gas = await publicClientA.estimateSendSuperchainERC20Gas({
        account: testAccount.address,
        tokenAddress: SUPERSIM_SUPERC20_ADDRESS,
        to: testAccount.address,
        amount: AMOUNT_TO_SEND,
        chainId: supersimL2B.id,
      })

      expect(gas).toBeDefined()
    })
  })

  describe('simulate', () => {
    it('should simulate', async () => {
      expect(() =>
        publicClientA.simulateSendSuperchainERC20({
          account: testAccount.address,
          tokenAddress: SUPERSIM_SUPERC20_ADDRESS,
          to: testAccount.address,
          amount: AMOUNT_TO_SEND,
          chainId: supersimL2B.id,
        }),
      ).not.throw()
    })
  })
})
