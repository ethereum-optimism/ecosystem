import type { RouterCaller } from '@trpc/server'
import type { PublicClient } from 'viem'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  getActiveContract,
  getDeploymentRebateByChainIdTxHash,
  getEntityByEntityId,
  getTotalRebatesClaimed,
  getWalletsByEntityId,
  getWalletVerifications,
  insertDeploymentRebate,
  setDeploymentRebateToSent,
} from '@/models'
import {
  ACTIVE_ENTITY,
  CB_VERIFIED_WALLET,
  CONTRACT_ID,
  createSignedInCaller,
  CREATION_DATE,
  DEPLOYMENT_REBATE,
  mockDB,
  mockLogger,
  mockPrivyClient,
  validSession,
  VERIFIED_CONTRACT,
  WALLET_VERIFICATIONS,
} from '@/testhelpers'
import { createL2PublicClient, createL2WalletClient } from '@/testUtils/anvil'
import { getRandomAddress } from '@/testUtils/getRandomAddress'
import { Trpc } from '@/Trpc'

import { RebatesRoute } from './RebatesRoute'

vi.mock('@/models', async () => ({
  // @ts-ignore - importActual returns unknown
  ...(await vi.importActual('@/models')),
  getEntityByEntityId: vi.fn(),
  getActiveContract: vi.fn(),
  getDeploymentRebateByChainIdTxHash: vi.fn(),
  getWalletVerifications: vi.fn(),
  getWalletsByEntityId: vi.fn(),
  getTotalRebatesClaimed: vi.fn(),
  insertDeploymentRebate: vi.fn(),
  setDeploymentRebateToSent: vi.fn(),
}))

describe(RebatesRoute.name, () => {
  let trpc: Trpc
  let caller: ReturnType<RouterCaller<RebatesRoute['handler']['_def']>>
  let publicClient: PublicClient

  beforeEach(async () => {
    vi.useFakeTimers()
    vi.setSystemTime(CREATION_DATE)
    const session = await validSession()
    const privyClient = mockPrivyClient()

    trpc = new Trpc(privyClient, mockLogger, mockDB)
    publicClient = createL2PublicClient()
    const l2WalletClient = createL2WalletClient()
    const route = new RebatesRoute(
      trpc,
      l2WalletClient as any,
      publicClient as any,
      l2WalletClient as any,
      publicClient as any,
    ).handler
    caller = createSignedInCaller({ router: route, session })
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.useRealTimers()
  })

  it('happy path for claiming a rebate', async () => {
    vi.mocked(getEntityByEntityId).mockReturnValue(
      Promise.resolve(ACTIVE_ENTITY),
    )
    vi.mocked(getActiveContract).mockReturnValue(
      Promise.resolve(VERIFIED_CONTRACT),
    )
    vi.mocked(getDeploymentRebateByChainIdTxHash).mockReturnValue(
      Promise.resolve(null),
    )
    vi.mocked(getWalletVerifications).mockReturnValue(
      Promise.resolve(WALLET_VERIFICATIONS),
    )
    vi.mocked(getWalletsByEntityId).mockReturnValue(
      Promise.resolve([CB_VERIFIED_WALLET]),
    )
    vi.mocked(getTotalRebatesClaimed).mockReturnValue(
      Promise.resolve(BigInt(0)),
    )
    vi.mocked(insertDeploymentRebate).mockReturnValue(
      Promise.resolve(DEPLOYMENT_REBATE),
    )
    vi.mocked(setDeploymentRebateToSent).mockReturnValue(
      Promise.resolve(DEPLOYMENT_REBATE),
    )

    const recipientAddress = getRandomAddress()

    const balanceBefore = await publicClient.getBalance({
      address: recipientAddress,
    })

    await caller.claimDeploymentRebate({
      contractId: CONTRACT_ID,
      recipientAddress,
    })

    const balanceAfter = await publicClient.getBalance({
      address: recipientAddress,
    })

    expect(balanceAfter - balanceBefore).toBe(
      BigInt(VERIFIED_CONTRACT.transaction!.gasUsed) *
        BigInt(VERIFIED_CONTRACT.transaction!.gasPrice),
    )
  })
})
