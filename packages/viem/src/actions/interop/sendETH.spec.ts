import { describe, expect, it } from 'vitest'

import { supersimL2B } from '@/chains/supersim.js'
import {
  publicClientA,
  publicClientB,
  testAccount,
  walletClientA,
  walletClientB,
} from '@/test/clients.js'
import {
  createInteropSentL2ToL2Messages,
  decodeRelayedL2ToL2Messages,
} from '@/utils/l2ToL2CrossDomainMessenger.js'

const AMOUNT_TO_SEND = 10n

describe('sendETH', () => {
  describe('write contract', () => {
    it('should return expected request', async () => {
      const startingBalance = await publicClientB.getBalance({
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

      const relayTxHash = await walletClientB.interop.relayMessage({
        sentMessageId: sentMessages[0].id,
        sentMessagePayload: sentMessages[0].payload,
      })
      expect(relayTxHash).toBeDefined()
      const relayReceipt = await publicClientB.waitForTransactionReceipt({
        hash: relayTxHash,
      })
      const { successfulMessages } = decodeRelayedL2ToL2Messages({
        receipt: relayReceipt,
      })
      expect(successfulMessages).length(1)

      const endingBalance = await publicClientB.getBalance({
        address: testAccount.address,
      })

      // TODO: fix after restructuring supersim
      expect(endingBalance > startingBalance)
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
