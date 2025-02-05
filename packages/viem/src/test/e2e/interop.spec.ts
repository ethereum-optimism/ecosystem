import { encodeFunctionData, parseAbi } from 'viem'
import { beforeAll, describe, expect, it } from 'vitest'

import { supersimL2B } from '@/chains/supersim.js'
import {
  publicClientA,
  publicClientB,
  testAccount,
  walletClientA,
  walletClientB,
} from '@/test/clients.js'
import { ticTacToeAbi, ticTacToeAddress } from '@/test/setupTicTacToe.js'
import {
  createInteropSentL2ToL2Messages,
  decodeRelayedL2ToL2Messages,
} from '@/utils/l2ToL2CrossDomainMessenger.js'

import { SUPERSIM_SUPERC20_ADDRESS } from '../supERC20.js'

describe('Generic Interop Flow', () => {
  const calldata = encodeFunctionData({
    abi: ticTacToeAbi,
    functionName: 'createGame',
    args: [testAccount.address],
  })

  it('should send and relay cross chain message', async () => {
    const sentMessageTxHash = await walletClientA.interop.sendMessage({
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
      {
        receipt,
      },
    )
    expect(sentMessages).length(1)

    // message was relayed on the other side
    const relayMessageTxHash = await walletClientB.interop.relayMessage({
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

describe('SuperchainERC20 Flow', () => {
  const balanceOfAbi = parseAbi([
    'function balanceOf(address account) view returns (uint256)',
  ])

  beforeAll(async () => {
    const hash = await walletClientA.writeContract({
      address: SUPERSIM_SUPERC20_ADDRESS,
      abi: parseAbi(['function mint(address to, uint256 amount)']),
      functionName: 'mint',
      args: [testAccount.address, 1000n],
    })

    await publicClientA.waitForTransactionReceipt({ hash })
  })

  it('should send supERC20 and relay cross chain message to burn/mint tokens', async () => {
    const startingBalance = await publicClientB.readContract({
      address: SUPERSIM_SUPERC20_ADDRESS,
      abi: balanceOfAbi,
      functionName: 'balanceOf',
      args: [testAccount.address],
    })

    const hash = await walletClientA.interop.sendSuperchainERC20({
      tokenAddress: SUPERSIM_SUPERC20_ADDRESS,
      to: testAccount.address,
      amount: 10n,
      chainId: supersimL2B.id,
    })

    const receipt = await publicClientA.waitForTransactionReceipt({ hash })

    const { sentMessages } = await createInteropSentL2ToL2Messages(
      publicClientA,
      {
        receipt,
      },
    )
    expect(sentMessages).toHaveLength(1)

    const relayMessageTxHash = await walletClientB.interop.relayMessage({
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

    const endingBalance = await publicClientB.readContract({
      address: SUPERSIM_SUPERC20_ADDRESS,
      abi: balanceOfAbi,
      functionName: 'balanceOf',
      args: [testAccount.address],
    })

    expect(endingBalance).toEqual(startingBalance + 10n)
  })
})

describe('Cross chain ETH transfer', () => {
  const AMOUNT_TO_SEND = 10n

  it('should send native ETH from source chain to destination chain', async () => {
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
      {
        receipt,
      },
    )
    expect(sentMessages).toHaveLength(1)

    const relayMessageTxHash = await walletClientB.interop.relayMessage({
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

    const gasPaid =
      relayMessageReceipt.gasUsed * relayMessageReceipt.effectiveGasPrice
    const endingBalance = await publicClientB.getBalance({
      address: testAccount.address,
    })
    expect(endingBalance).toEqual(startingBalance + AMOUNT_TO_SEND - gasPaid)
  })
})
