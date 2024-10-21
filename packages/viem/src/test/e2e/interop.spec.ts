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
import { ticTacToeABI, ticTacToeAddress } from '@/test/setupTicTacToe.js'
import {
  createInteropSentL2ToL2Messages,
  decodeRelayedL2ToL2Messages,
} from '@/utils/l2ToL2CrossDomainMessenger.js'

describe('Generic Interop Flow', () => {
  const calldata = encodeFunctionData({
    abi: ticTacToeABI,
    functionName: 'createGame',
    args: [testAccount.address],
  })

  it('should send and execute cross chain message', async () => {
    const sentMessageTxHash = await walletClientA.sendL2ToL2Message({
      account: testAccount.address,
      destinationChainId: supersimL2B.id,
      target: ticTacToeAddress,
      message: calldata,
    })

    const receipt = await publicClientA.waitForTransactionReceipt({
      hash: sentMessageTxHash,
    })
    const { sentMessages } = await createInteropSentL2ToL2Messages(
      publicClientA,
      { receipt },
    )
    expect(sentMessages).length(1)

    // message was relayed on the other side
    const relayMessageTxHash = await walletClientB.relayL2ToL2Message({
      account: testAccount.address,
      sentMessageId: sentMessages[0].id,
      sentMessagePayload: sentMessages[0].payload,
    })

    const relayMessageReceipt = await publicClientB.waitForTransactionReceipt({
      hash: relayMessageTxHash,
    })
    const { successfulMessages } = decodeRelayedL2ToL2Messages({
      receipt: relayMessageReceipt,
    })
    expect(successfulMessages).length(1)
  })
})
