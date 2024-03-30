import type { PrivyClient } from '@privy-io/server-auth'
import type { RouterCaller } from '@trpc/server'
import type { getIronSession } from 'iron-session'
import type { Address } from 'viem'
import type { Mock } from 'vitest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { SessionData } from '@/constants'
import {
  getWalletsByEntityId,
  insertWallet,
  updateWallet,
  WalletLinkType,
  WalletState,
} from '@/models'
import {
  createSignedInCaller,
  createSignedOutCaller,
  mockDB,
  mockLogger,
  mockPrivyClient,
  validSession,
} from '@/testhelpers'
import { getRandomAddress } from '@/testUtils/getRandomAddress'
import { Trpc } from '@/Trpc'

import { WalletsRoute } from './WalletsRoute'

vi.mock('@/models', async () => ({
  // @ts-ignore - importActual returns unknown
  ...(await vi.importActual('@/models')),
  getWalletsByEntityId: vi.fn(),
  insertWallet: vi.fn(),
  updateWallet: vi.fn(),
}))

describe(WalletsRoute.name, () => {
  let caller: ReturnType<RouterCaller<WalletsRoute['handler']['_def']>>
  let handler: WalletsRoute['handler']
  let privyClient: PrivyClient
  let session: Awaited<ReturnType<typeof getIronSession<SessionData>>>

  beforeEach(async () => {
    vi.useFakeTimers().setSystemTime(new Date('04/20/2020'))
    privyClient = mockPrivyClient()
    ;(privyClient.verifyAuthToken as Mock).mockImplementation(async () => ({
      userId: 'privy:did',
    }))
    const trpc = new Trpc(privyClient, mockLogger, mockDB)
    handler = new WalletsRoute(trpc).handler
    session = await validSession()
    caller = createSignedInCaller(handler, session)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  const mockPrivyWallets = (addresses: Address[]) => {
    ;(privyClient.getUser as Mock).mockImplementation(async () => ({
      linkedAccounts: addresses.map((address) => ({ type: 'wallet', address })),
    }))
  }

  describe('syncWallets', () => {
    it('should return 401 if user is not logged in', async () => {
      caller = createSignedOutCaller(handler)

      await expect(caller.syncWallets()).rejects.toEqual(Trpc.handleStatus(401))
    })

    it(
      'for an entity with no wallets in the wallet table, all wallets from privy are inserted ' +
        'into the wallets table',
      async () => {
        const mockWallets = [getRandomAddress(), getRandomAddress()]
        mockPrivyWallets(mockWallets)
        ;(getWalletsByEntityId as Mock).mockImplementation(async () => [])

        await caller.syncWallets()

        expect(insertWallet).toBeCalledTimes(2)
        expect(insertWallet).toHaveBeenNthCalledWith(1, mockDB, {
          entityId: session.user?.entityId,
          address: mockWallets[0],
          state: WalletState.ACTIVE,
          linkType: WalletLinkType.PRIVY,
        })
        expect(insertWallet).toHaveBeenNthCalledWith(2, mockDB, {
          entityId: session.user?.entityId,
          address: mockWallets[1],
          state: WalletState.ACTIVE,
          linkType: WalletLinkType.PRIVY,
        })
      },
    )

    describe('for an entity with wallets in the wallet table', () => {
      it('unlinks the wallets that are in the wallet table but no longer in privy', async () => {
        const existingWallet = {
          id: 'wallet1',
          address: getRandomAddress(),
          linkType: WalletLinkType.PRIVY,
          state: WalletState.ACTIVE,
        }
        const oldWallet = {
          id: 'wallet2',
          address: getRandomAddress(),
          linkType: WalletLinkType.PRIVY,
          state: WalletState.ACTIVE,
        }
        const mockEntityWallets = [existingWallet, oldWallet]
        mockPrivyWallets([existingWallet.address])
        ;(getWalletsByEntityId as Mock).mockImplementation(
          async () => mockEntityWallets,
        )

        await caller.syncWallets()

        expect(insertWallet).not.toBeCalled()
        expect(updateWallet).toHaveBeenCalledTimes(1)
        expect(updateWallet).toHaveBeenCalledWith(mockDB, oldWallet.id, {
          state: WalletState.UNLINKED,
          unlinkedAt: new Date(),
        })
      })

      it('re-links the wallets that are in the wallet table that are in privy', async () => {
        const existingWallet = {
          id: 'wallet1',
          address: getRandomAddress(),
          linkType: WalletLinkType.PRIVY,
          state: WalletState.ACTIVE,
        }
        const previouslyUnlinkedWallet = {
          id: 'wallet2',
          address: getRandomAddress(),
          linkType: WalletLinkType.PRIVY,
          state: WalletState.UNLINKED,
        }
        const mockEntityWallets = [existingWallet, previouslyUnlinkedWallet]
        mockPrivyWallets([
          existingWallet.address,
          previouslyUnlinkedWallet.address,
        ])
        ;(getWalletsByEntityId as Mock).mockImplementation(
          async () => mockEntityWallets,
        )

        await caller.syncWallets()

        expect(insertWallet).not.toBeCalled()
        expect(updateWallet).toHaveBeenCalledTimes(1)
        expect(updateWallet).toHaveBeenCalledWith(
          mockDB,
          previouslyUnlinkedWallet.id,
          {
            state: WalletState.ACTIVE,
            unlinkedAt: null,
          },
        )
      })

      it('updates and inserts wallets when needed', async () => {
        const previouslyUnlinkedWallet = {
          id: 'wallet2',
          address: getRandomAddress(),
          linkType: WalletLinkType.PRIVY,
          state: WalletState.UNLINKED,
        }
        const newPrivyWallet = getRandomAddress()
        const mockEntityWallets = [previouslyUnlinkedWallet]
        mockPrivyWallets([newPrivyWallet, previouslyUnlinkedWallet.address])
        ;(getWalletsByEntityId as Mock).mockImplementation(
          async () => mockEntityWallets,
        )

        await caller.syncWallets()

        expect(insertWallet).toBeCalledTimes(1)
        expect(insertWallet).toHaveBeenCalledWith(mockDB, {
          entityId: session.user?.entityId,
          address: newPrivyWallet,
          state: WalletState.ACTIVE,
          linkType: WalletLinkType.PRIVY,
        })
        expect(updateWallet).toHaveBeenCalledTimes(1)
        expect(updateWallet).toHaveBeenCalledWith(
          mockDB,
          previouslyUnlinkedWallet.id,
          {
            state: WalletState.ACTIVE,
            unlinkedAt: null,
          },
        )
      })

      it(
        'does nothing if the wallets returned by privy match the wallets ' +
          'already in the db',
        async () => {
          const checkSummedAddress =
            '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
          mockPrivyWallets([checkSummedAddress.toLowerCase() as Address])
          const dbWallet = {
            id: 'wallet1',
            address: checkSummedAddress,
            linkType: WalletLinkType.PRIVY,
            state: WalletState.ACTIVE,
          }
          ;(getWalletsByEntityId as Mock).mockImplementation(async () => [
            dbWallet,
          ])

          await caller.syncWallets()

          expect(insertWallet).not.toBeCalled()
          expect(updateWallet).not.toBeCalled()
        },
      )
    })
  })
})
