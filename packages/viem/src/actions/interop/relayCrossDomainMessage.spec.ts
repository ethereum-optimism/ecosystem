import { encodeFunctionData } from 'viem'
import { describe, expect, it } from 'vitest'

import { supersimL2B } from '@/chains/supersim.js'
import {
  publicClientA,
  publicClientB,
  testAccount,
  walletClientA,
  walletClientB,
} from '@/test/clients.js'
import { ticTacToeAbi, ticTacToeAddress } from '@/test/setupTicTacToe.js'

describe('relayMessage', () => {
  const calldata = encodeFunctionData({
    abi: ticTacToeAbi,
    functionName: 'createGame',
    args: [testAccount.address],
  })

  describe('estimate gas', () => {
    it('should estimate gas', async () => {
      const hash = await walletClientA.interop.sendCrossDomainMessage({
        account: testAccount.address,
        destinationChainId: supersimL2B.id,
        target: ticTacToeAddress,
        message: calldata,
      })

      const receipt = await publicClientA.waitForTransactionReceipt({ hash })
      const messages = await publicClientA.interop.getCrossDomainMessages({
        logs: receipt.logs,
      })
      expect(messages).length(1)

      const params = await publicClientA.interop.buildExecutingMessage({
        log: messages[0].log,
      })
      // CrossL2Inbox rejects relayMessage when tx.gasprice is 0 and basefee is
      // not, to stop deposits executing messages. Estimating and simulating
      // default the price to 0, so both have to be given a real one.
      const maxFeePerGas = await publicClientB.getGasPrice()
      const gas =
        await publicClientB.interop.estimateRelayCrossDomainMessageGas({
          account: testAccount.address,
          maxFeePerGas,
          ...params,
        })
      expect(gas).toBeDefined()
    })
  })

  describe('simulate', () => {
    it('should simulate', async () => {
      const hash = await walletClientA.interop.sendCrossDomainMessage({
        account: testAccount.address,
        destinationChainId: supersimL2B.id,
        target: ticTacToeAddress,
        message: calldata,
      })

      const receipt = await publicClientA.waitForTransactionReceipt({ hash })
      const messages = await publicClientA.interop.getCrossDomainMessages({
        logs: receipt.logs,
      })
      expect(messages).length(1)

      const params = await publicClientA.interop.buildExecutingMessage({
        log: messages[0].log,
      })
      const maxFeePerGas = await publicClientB.getGasPrice()
      const result =
        await publicClientB.interop.simulateRelayCrossDomainMessage({
          account: testAccount,
          maxFeePerGas,
          ...params,
        })
      expect(result).toBeDefined()
    })
  })

  describe('write contract', () => {
    it('should return expected request', async () => {
      const hash = await walletClientA.interop.sendCrossDomainMessage({
        account: testAccount.address,
        destinationChainId: supersimL2B.id,
        target: ticTacToeAddress,
        message: calldata,
      })

      const receipt = await publicClientA.waitForTransactionReceipt({ hash })
      const messages = await publicClientA.interop.getCrossDomainMessages({
        logs: receipt.logs,
      })
      expect(messages).length(1)

      const status = await publicClientB.interop.getCrossDomainMessageStatus({
        message: messages[0],
      })
      expect(status).toEqual('ready-to-relay')

      const params = await publicClientA.interop.buildExecutingMessage({
        log: messages[0].log,
      })

      const relayTxHash = await walletClientB.interop.relayCrossDomainMessage(
        params,
      )
      expect(relayTxHash).toBeDefined()

      await publicClientB.waitForTransactionReceipt({ hash: relayTxHash })
      const _status = await publicClientB.interop.getCrossDomainMessageStatus({
        message: messages[0],
      })
      expect(_status).toEqual('relayed')
    })
  })
})
