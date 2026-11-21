import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { describe, expect, it } from 'vitest'

import { supersimL2A } from '@/chains/supersim.js'
import { publicActionsL2 } from '@/decorators/publicL2.js'
import { walletActionsL2 } from '@/decorators/walletL2.js'

const account = privateKeyToAccount(
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
)

const publicInteropKeys = [
  'buildExecutingMessage',
  'estimateSendCrossDomainMessageGas',
  'estimateRelayCrossDomainMessageGas',
  'estimateSendSuperchainERC20Gas',
  'estimateSendETHGas',
  'getCrossDomainMessages',
  'getCrossDomainMessageStatus',
  'simulateSendCrossDomainMessage',
  'simulateRelayCrossDomainMessage',
  'simulateSendSuperchainERC20',
  'simulateSendETH',
] as const

const walletInteropKeys = [
  'sendCrossDomainMessage',
  'relayCrossDomainMessage',
  'sendSuperchainERC20',
  'sendETH',
] as const

function createBaseWallet() {
  return createWalletClient({
    account,
    chain: supersimL2A,
    transport: http(),
  })
}

function expectInteropKeys(
  interop: Record<string, unknown>,
  keys: readonly string[],
) {
  for (const key of keys) {
    expect(interop, `missing interop.${key}`).toHaveProperty(key)
    expect(typeof interop[key]).toBe('function')
  }
}

describe('L2 action decorators', () => {
  it('exposes public interop helpers after publicActionsL2()', () => {
    const client = createBaseWallet().extend(publicActionsL2())
    expectInteropKeys(client.interop, publicInteropKeys)
  })

  it('exposes wallet interop helpers after walletActionsL2()', () => {
    const client = createBaseWallet().extend(walletActionsL2())
    expectInteropKeys(client.interop, walletInteropKeys)
  })

  it('keeps public interop helpers after extending walletActionsL2()', () => {
    const client = createBaseWallet()
      .extend(publicActionsL2())
      .extend(walletActionsL2())

    expectInteropKeys(client.interop, publicInteropKeys)
    expectInteropKeys(client.interop, walletInteropKeys)
  })

  it('keeps wallet interop helpers after extending publicActionsL2() last', () => {
    const client = createBaseWallet()
      .extend(walletActionsL2())
      .extend(publicActionsL2())

    expectInteropKeys(client.interop, publicInteropKeys)
    expectInteropKeys(client.interop, walletInteropKeys)
  })
})
