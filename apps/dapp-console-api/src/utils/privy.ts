import type { PrivyClient, WalletWithMetadata } from '@privy-io/server-auth'
import type { Address } from 'viem'

import type { Database } from '@/db'
import type { Entity, Wallet } from '@/models'
import {
  getWalletsByEntityId,
  insertWallet,
  updateWallet,
  WalletLinkType,
  WalletState,
} from '@/models'

import { addressEqualityCheck } from './helpers'

/**
 * Fetches the latest linked wallets for @param privyDid and updates the wallets table for the
 * @param entityId with those wallets.
 */
export const fetchAndSyncPrivyWallets = async (
  db: Database,
  privyClient: PrivyClient,
  privyDid: string,
  entityId: string,
) => {
  const privyLinkedWallets = await fetchLinkedWallets(privyClient, privyDid)
  return syncPrivyWallets(db, entityId, privyLinkedWallets)
}

const fetchLinkedWallets = async (
  privyClient: PrivyClient,
  privyDid: string,
) => {
  const user = await privyClient.getUser(privyDid)
  const wallets = user.linkedAccounts.filter(
    (account) =>
      // Do not include the embedded wallet that is auto-created by privy
      account.type === 'wallet' && account.walletClientType !== 'privy',
  ) as WalletWithMetadata[]
  return wallets.map((wallet) => wallet.address as Address)
}

/**
 * Using the wallets associated with @param entityId update the wallets with
 * @enum LinkType.PRIVY to match @param privyAddresses
 */
const syncPrivyWallets = async (
  db: Database,
  entityId: Entity['id'],
  privyAddresses: Address[],
) => {
  const entityWallets = await getWalletsByEntityId(db, entityId)
  await updateExistingPrivyWallets(db, entityId, entityWallets, privyAddresses)
  return addNewPrivyWallets(db, entityId, entityWallets, privyAddresses)
}

/**
 * Inserts a new wallet for each address in @param privyAddresses that is not contained in @param entityWallets
 */
const addNewPrivyWallets = async (
  db: Database,
  entityId: Entity['id'],
  entityWallets: Wallet[],
  privyAddresses: Address[],
) => {
  return Promise.all(
    privyAddresses.map((privyAddress) => {
      if (
        entityWallets.find((entityWallet) =>
          addressEqualityCheck(entityWallet.address, privyAddress),
        )
      ) {
        return Promise.resolve({})
      }

      return insertWallet(db, {
        entityId,
        address: privyAddress,
        state: WalletState.ACTIVE,
        linkType: WalletLinkType.PRIVY,
      })
    }),
  )
}

/**
 * Handles unlinking privy wallets that are no longer linked to the privy account and re-linking wallets
 * that were previously unlinked from the privy account.
 */
const updateExistingPrivyWallets = async (
  db: Database,
  entityId: Wallet['entityId'],
  entityWallets: Wallet[],
  privyAddresses: Address[],
) => {
  return Promise.all(
    entityWallets.map((entityWallet) => {
      if (entityWallet.linkType !== WalletLinkType.PRIVY) {
        return Promise.resolve({})
      }

      if (
        entityWallet.state === WalletState.ACTIVE &&
        !privyAddresses.find((privyAddress) =>
          addressEqualityCheck(entityWallet.address, privyAddress),
        )
      ) {
        return updateWallet({
          db,
          walletId: entityWallet.id,
          entityId,
          update: {
            state: WalletState.UNLINKED,
            unlinkedAt: new Date(),
          },
        })
      }

      if (
        entityWallet.state === WalletState.UNLINKED &&
        !!privyAddresses.find((privyAddress) =>
          addressEqualityCheck(entityWallet.address, privyAddress),
        )
      ) {
        return updateWallet({
          db,
          entityId,
          walletId: entityWallet.id,
          update: {
            state: WalletState.ACTIVE,
            unlinkedAt: null,
          },
        })
      }

      return Promise.resolve({})
    }),
  )
}
