import { parseAbi } from 'viem'
import { beforeAll, describe, expect, it } from 'vitest'

import { supersimL2B } from '@/chains/supersim.js'
import { publicClientA, testAccount, walletClientA } from '@/test/clients.js'
import { SUPERSIM_SUPERC20_ADDRESS } from '@/test/supERC20.js'
import { createInteropSentL2ToL2Messages } from '@/utils/l2ToL2CrossDomainMessenger.js'

const balanceOfABI = parseAbi([
  'function balanceOf(address account) view returns (uint256)',
])

describe('sendSupERC20', () => {
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
        abi: balanceOfABI,
        functionName: 'balanceOf',
        args: [testAccount.address],
      })

      const hash = await walletClientA.sendSupERC20({
        tokenAddress: SUPERSIM_SUPERC20_ADDRESS,
        to: testAccount.address,
        amount: 1000n,
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
        abi: balanceOfABI,
        functionName: 'balanceOf',
        args: [testAccount.address],
      })

      expect(endingBalance).toEqual(startingBalance - 1000n)
    })
  })

  describe('estimate gas', () => {
    it('should estimate gas', async () => {
      const gas = await publicClientA.estimateSendSupERC20Gas({
        account: testAccount.address,
        tokenAddress: SUPERSIM_SUPERC20_ADDRESS,
        to: testAccount.address,
        amount: 1000n,
        chainId: supersimL2B.id,
      })

      expect(gas).toBeDefined()
    })
  })

  describe('simulate', () => {
    it('should simulate', async () => {
      expect(() =>
        publicClientA.simulateSendSupERC20({
          account: testAccount.address,
          tokenAddress: SUPERSIM_SUPERC20_ADDRESS,
          to: testAccount.address,
          amount: 1000n,
          chainId: supersimL2B.id,
        }),
      ).not.throw()
    })
  })
})
