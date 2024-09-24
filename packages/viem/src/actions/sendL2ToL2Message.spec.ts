import { encodeFunctionData } from 'viem'
import { describe, expect, it } from 'vitest'

import { l2ToL2CrossDomainMessengerABI } from '@/abis.js'
import { buildSendL2ToL2Message } from '@/actions/buildSendL2ToL2Message.js'
import { supersimL2A, supersimL2B } from '@/chains/supersim.js'
import { contracts } from '@/contracts.js'
import { publicClient, testAccount, walletClient } from '@/test/clients.js'
import { ticTacToeABI, ticTacToeAddress } from '@/test/setupTicTacToe.js'
import { decodeSentMessage } from '@/utils/decodeSentMessage.js'
import { extractMessageIdentifierFromLogs } from '@/utils/extractMessageIdentifierFromLogs.js'

describe('sendL2ToL2Message', () => {
  describe('write contract', () => {
    it('should return expected request', async () => {
      const encodedData = encodeFunctionData({
        abi: ticTacToeABI,
        functionName: 'createGame',
        args: [testAccount.address],
      })

      const args = await buildSendL2ToL2Message(publicClient, {
        account: testAccount.address,
        destinationChainId: supersimL2B.id,
        target: ticTacToeAddress,
        message: encodedData,
      })

      const hash = await walletClient.sendL2ToL2Message(args)
      expect(hash).toBeDefined()

      const receipt = await publicClient.waitForTransactionReceipt({ hash })
      const { id, payload } = await extractMessageIdentifierFromLogs(
        publicClient,
        { receipt },
      )

      // verifiy message id
      expect(id).toBeDefined()
      expect(id.chainId).toEqual(BigInt(supersimL2A.id))
      expect(id.origin.toLowerCase()).toEqual(
        contracts.l2ToL2CrossDomainMessenger.address.toLowerCase(),
      )
      expect(id.blockNumber).toEqual(receipt.blockNumber)
      expect(id.logIndex).toEqual(BigInt(receipt.logs[0].logIndex))

      // verify payload
      const currentNonce = await publicClient.readContract({
        abi: l2ToL2CrossDomainMessengerABI,
        address: contracts.l2ToL2CrossDomainMessenger.address,
        functionName: 'messageNonce',
      })

      const decodedPayload = decodeSentMessage({ payload })
      expect(decodedPayload).toEqual({
        origin: BigInt(supersimL2A.id),
        destination: BigInt(supersimL2B.id),
        messageNonce: currentNonce - 1n,
        sender: testAccount.address,
        target: ticTacToeAddress,
        message: encodedData,
      })
    })
  })

  describe('estimate gas', () => {
    it('should estimate gas', async () => {
      const encodedMessage = encodeFunctionData({
        abi: ticTacToeABI,
        functionName: 'createGame',
        args: [testAccount.address],
      })

      const gas = await publicClient.estimateSendL2ToL2MessageGas({
        account: testAccount.address,
        target: ticTacToeAddress,
        destinationChainId: supersimL2B.id,
        message: encodedMessage,
      })

      expect(gas).toBeDefined()
    })
  })
})
