import type { Hex } from 'viem'
import {
  createClient,
  custom,
  decodeFunctionData,
  encodeFunctionData,
  encodeFunctionResult,
  numberToHex,
} from 'viem'
import { describe, expect, it } from 'vitest'

import {
  ethLiquidityAbi,
  l2ToL2CrossDomainMessengerAbi,
  superchainETHBridgeAbi,
  undeliveredMessageExporterAbi,
} from '@/abis/index.js'
import { DEFAULT_EXPORT_UNDELIVERED_MESSAGE_MIN_GAS_LIMIT } from '@/actions/interop/exportUndeliveredMessage.js'
import {
  getCrossDomainMessageExpiry,
  getETHLiquidityPaused,
  InvalidSourceChainError,
  simulateExportUndeliveredMessage,
  simulateRefundETH,
} from '@/actions/interop/index.js'
import { op, unichain } from '@/chains/mainnet.js'
import { interopContracts } from '@/contracts.js'
import type { CrossDomainMessageFields } from '@/types/interop/cdm.js'
import { hashCrossDomainMessage } from '@/utils/interop/hashCrossDomainMessage.js'

const OP_MAINNET = op.id
const UNICHAIN = unichain.id
const account = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
const sourceMessenger = '0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1'

const message: CrossDomainMessageFields = {
  source: BigInt(OP_MAINNET),
  destination: BigInt(UNICHAIN),
  nonce: 7n,
  sender: interopContracts.superchainETHBridge.address,
  target: interopContracts.superchainETHBridge.address,
  message: encodeFunctionData({
    abi: superchainETHBridgeAbi,
    functionName: 'relayETH',
    args: [account, account, 1000n],
  }),
}

type Call = { to: Hex; data: Hex }

/**
 * A client whose transport answers `eth_chainId` and serves `eth_call` from
 * `handler`, recording each call. No node is needed.
 */
function mockClient(
  chain: typeof op | typeof unichain,
  handler: (call: Call) => Hex,
) {
  const chainId = chain.id
  const calls: Call[] = []
  const client = createClient({
    chain,
    transport: custom({
      async request({ method, params }) {
        if (method === 'eth_chainId') return numberToHex(chainId)
        if (method === 'eth_call') {
          const call = (params as [Call])[0]
          calls.push(call)
          return handler(call)
        }
        throw new Error(`unexpected method ${method}`)
      },
    }),
  })
  return { client, calls }
}

describe('Lagoon ABIs', () => {
  const names = (abi: ReadonlyArray<{ type: string; name?: string }>) =>
    abi.map((item) => `${item.type}:${item.name}`)

  it('L2ToL2CrossDomainMessenger has message expiry', () => {
    expect(names(l2ToL2CrossDomainMessengerAbi)).toEqual(
      expect.arrayContaining([
        'function:expiredMessages',
        'function:sentMessageTimestamps',
        'function:expiryPeriod',
        'function:expireMessage',
        'event:MessageExpired',
      ]),
    )
    // Removed from the contract.
    expect(names(l2ToL2CrossDomainMessengerAbi)).not.toContain(
      'function:resendMessage',
    )
  })

  it('SuperchainETHBridge has refunds', () => {
    expect(names(superchainETHBridgeAbi)).toEqual(
      expect.arrayContaining([
        'function:refundETH',
        'function:refunded',
        'event:RefundETH',
        'error:SuperchainETHBridge_MessageNotExpired',
        'error:SuperchainETHBridge_AlreadyRefunded',
      ]),
    )
  })

  it('ETHLiquidity has the pause', () => {
    expect(names(ethLiquidityAbi)).toEqual(
      expect.arrayContaining([
        'function:paused',
        'function:setPaused',
        'event:PausedSet',
        'error:ETHLiquidity_Paused',
      ]),
    )
  })

  it('UndeliveredMessageExporter exports undelivered messages', () => {
    expect(names(undeliveredMessageExporterAbi)).toEqual(
      expect.arrayContaining([
        'function:exportUndeliveredMessage',
        'event:UndeliveredMessageExported',
        'error:UndeliveredMessageExporter_MessageRelayed',
      ]),
    )
  })

  it('has the Lagoon predeploy addresses', () => {
    expect(interopContracts.ethLiquidity.address).toBe(
      '0x4200000000000000000000000000000000000025',
    )
    expect(interopContracts.undeliveredMessageExporter.address).toBe(
      '0x4200000000000000000000000000000000000030',
    )
  })
})

describe('getCrossDomainMessageExpiry', () => {
  const messageHash = hashCrossDomainMessage(message)
  const sentAt = 1_800_000_000n
  const expiryPeriod = 691_200n

  function handler(expired: boolean, sentAt_: bigint) {
    return (call: Call) => {
      expect(call.to.toLowerCase()).toBe(
        interopContracts.l2ToL2CrossDomainMessenger.address.toLowerCase(),
      )
      const { functionName, args } = decodeFunctionData({
        abi: l2ToL2CrossDomainMessengerAbi,
        data: call.data,
      })
      switch (functionName) {
        case 'expiredMessages':
          expect(args).toEqual([messageHash])
          return encodeFunctionResult({
            abi: l2ToL2CrossDomainMessengerAbi,
            functionName,
            result: expired,
          })
        case 'sentMessageTimestamps':
          expect(args).toEqual([messageHash])
          return encodeFunctionResult({
            abi: l2ToL2CrossDomainMessengerAbi,
            functionName,
            result: sentAt_,
          })
        case 'expiryPeriod':
          return encodeFunctionResult({
            abi: l2ToL2CrossDomainMessengerAbi,
            functionName,
            result: expiryPeriod,
          })
        default:
          throw new Error(`unexpected call ${functionName}`)
      }
    }
  }

  it('reads the expiry state on the source chain', async () => {
    const { client } = mockClient(op, handler(false, sentAt))
    await expect(
      getCrossDomainMessageExpiry(client, { message }),
    ).resolves.toEqual({
      messageHash,
      expired: false,
      sentAt,
      expiryPeriod,
      exportableAfter: sentAt + expiryPeriod,
    })
  })

  it('reports an expired message', async () => {
    const { client } = mockClient(op, handler(true, sentAt))
    const res = await getCrossDomainMessageExpiry(client, { message })
    expect(res.expired).toBe(true)
  })

  it('has no export time for a message without a send timestamp', async () => {
    const { client } = mockClient(op, handler(false, 0n))
    const res = await getCrossDomainMessageExpiry(client, { message })
    expect(res.sentAt).toBe(0n)
    expect(res.exportableAfter).toBeNull()
  })

  it('throws when the client is not on the source chain', async () => {
    const { client } = mockClient(unichain, handler(false, sentAt))
    await expect(
      getCrossDomainMessageExpiry(client, { message }),
    ).rejects.toBeInstanceOf(InvalidSourceChainError)
  })
})

describe('getETHLiquidityPaused', () => {
  it.each([true, false])('returns paused = %s', async (paused) => {
    const { client, calls } = mockClient(unichain, () =>
      encodeFunctionResult({
        abi: ethLiquidityAbi,
        functionName: 'paused',
        result: paused,
      }),
    )
    await expect(getETHLiquidityPaused(client)).resolves.toBe(paused)
    expect(calls[0].to.toLowerCase()).toBe(
      interopContracts.ethLiquidity.address.toLowerCase(),
    )
  })
})

describe('simulateExportUndeliveredMessage', () => {
  const messageHash = hashCrossDomainMessage(message)

  function exporter() {
    return mockClient(unichain, (call) => {
      expect(call.to.toLowerCase()).toBe(
        interopContracts.undeliveredMessageExporter.address.toLowerCase(),
      )
      return encodeFunctionResult({
        abi: undeliveredMessageExporterAbi,
        functionName: 'exportUndeliveredMessage',
        result: messageHash,
      })
    })
  }

  it('encodes the message and defaults the L1 gas limit', async () => {
    const { client, calls } = exporter()
    await expect(
      simulateExportUndeliveredMessage(client, {
        account,
        message,
        sourceMessenger,
      }),
    ).resolves.toBe(messageHash)

    const { functionName, args } = decodeFunctionData({
      abi: undeliveredMessageExporterAbi,
      data: calls[0].data,
    })
    expect(functionName).toBe('exportUndeliveredMessage')
    expect(args).toEqual([
      sourceMessenger,
      message.source,
      message.nonce,
      message.sender,
      message.target,
      message.message,
      DEFAULT_EXPORT_UNDELIVERED_MESSAGE_MIN_GAS_LIMIT,
    ])
  })

  it('passes a custom L1 gas limit', async () => {
    const { client, calls } = exporter()
    await simulateExportUndeliveredMessage(client, {
      account,
      message,
      sourceMessenger,
      minGasLimit: 2_000_000,
    })
    const { args } = decodeFunctionData({
      abi: undeliveredMessageExporterAbi,
      data: calls[0].data,
    })
    expect((args as readonly unknown[])[6]).toBe(2_000_000)
  })
})

describe('simulateRefundETH', () => {
  it('encodes the refund of an expired sendETH', async () => {
    const { client, calls } = mockClient(op, () => '0x')
    await simulateRefundETH(client, {
      account,
      destinationChainId: UNICHAIN,
      messageNonce: message.nonce,
      to: account,
      amount: 1000n,
    })

    expect(calls[0].to.toLowerCase()).toBe(
      interopContracts.superchainETHBridge.address.toLowerCase(),
    )
    const { functionName, args } = decodeFunctionData({
      abi: superchainETHBridgeAbi,
      data: calls[0].data,
    })
    expect(functionName).toBe('refundETH')
    expect(args).toEqual([BigInt(UNICHAIN), message.nonce, account, 1000n])
  })
})
