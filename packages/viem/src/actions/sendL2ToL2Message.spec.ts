import { decodeFunctionData, encodeFunctionData } from 'viem'
import { base, optimism } from 'viem/chains'
import { describe, expect, it } from 'vitest'

import { l2ToL2CrossDomainMessengerABI } from '@/abis.js'
import { buildSendL2ToL2Message } from '@/actions/buildSendL2ToL2Message.js'
import { contracts } from '@/contracts.js'
import { publicClient, testAccount, walletClient } from '@/test/clients.js'
import { ticTacToeABI, ticTacToeAddress } from '@/test/setupTicTacToe.js'
import { extractMessageIdentifierFromLogs } from '@/utils/extractMessageIdentifierFromLogs.js'

describe('sendL2ToL2Message', () => {
  it('should return expected request', async () => {
    const encodedData = encodeFunctionData({
      abi: ticTacToeABI,
      functionName: 'createGame',
      args: [testAccount.address],
    })

    const args = await buildSendL2ToL2Message(publicClient, {
      account: testAccount.address,
      destinationChainId: base.id,
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

    const decodedPayload = decodeFunctionData({
      abi: l2ToL2CrossDomainMessengerABI,
      data: payload,
    })

    // verifiy message id
    expect(id).toBeDefined()
    expect(id.chainId).toEqual(BigInt(optimism.id))
    expect(id.origin.toLowerCase()).toEqual(testAccount.address.toLowerCase())
    expect(id.blockNumber).toEqual(receipt.blockNumber)
    expect(id.logIndex).toEqual(BigInt(receipt.logs[0].logIndex))

    // verify payload
    const currentNonce = await publicClient.readContract({
      abi: l2ToL2CrossDomainMessengerABI,
      address: contracts.l2ToL2CrossDomainMessenger.address,
      functionName: 'messageNonce',
    })

    expect(decodedPayload.args).toEqual([
      BigInt(base.id),
      BigInt(optimism.id),
      currentNonce - 1n,
      testAccount.address,
      ticTacToeAddress,
      encodedData,
    ])
  })
})
