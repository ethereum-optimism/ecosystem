import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { and, eq } from 'drizzle-orm'
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import type { Address } from 'viem'

import type { Database } from '@/db'

import type { Entity } from './entities'
import { entities } from './entities'

enum WalletState {
  ACTIVE = 'active',
  DISABLED = 'disabled',
  SANCTIONED = 'sanctioned',
  UNLINKED = 'unlinked',
}

enum LinkType {
  PRIVY = 'privy',
}

type AddressVerification = {}

export const wallets = pgTable(
  'wallets',
  {
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    id: uuid('id').defaultRandom().primaryKey(),
    entityId: uuid('entity_id')
      .references(() => entities.id)
      .notNull(),
    address: varchar('address').$type<Address>().notNull(),
    linkType: varchar('link_type')
      .$type<LinkType>()
      .default(LinkType.PRIVY)
      .notNull(),
    verifications: jsonb('verifications')
      .$type<AddressVerification>()
      .default({})
      .notNull(),
    state: varchar('state')
      .$type<WalletState>()
      .default(WalletState.ACTIVE)
      .notNull(),
    unlinkedAt: timestamp('unlinked_at', { withTimezone: true }),
    disabledAt: timestamp('disabled_at', { withTimezone: true }),
    sanctionedAt: timestamp('sanctioned_at', { withTimezone: true }),
  },
  (table) => {
    return {
      entityIdAddressIdx: uniqueIndex().on(table.entityId, table.address),
      entityIdx: index().on(table.entityId),
      addressIdx: index().on(table.address),
    }
  },
)

export type Wallet = InferSelectModel<typeof wallets>
export type InsertWallet = InferInsertModel<typeof wallets>
export type UpdateWallet = Partial<
  Pick<
    Wallet,
    | 'linkType'
    | 'verifications'
    | 'state'
    | 'unlinkedAt'
    | 'disabledAt'
    | 'sanctionedAt'
  >
>

export const getWalletsByEntityId = async (
  db: Database,
  entityId: Entity['id'],
) => {
  return db
    .select()
    .from(wallets)
    .where(and(eq(wallets.entityId, entityId)))
}

export const insertWallet = async (db: Database, newWallet: InsertWallet) => {
  const result = await db.insert(wallets).values(newWallet).returning()

  return result[0]
}

export const updateWallet = async (
  db: Database,
  walletId: Wallet['id'],
  update: UpdateWallet,
) => {
  return db.update(wallets).set(update).where(eq(wallets.id, walletId))
}

/**
 * Using the wallets associated with @param entityId update the wallets with
 * @enum LinkType.PRIVY to match @param privyAddresses
 */
export const syncPrivyWallets = async (
  db: Database,
  entityId: Entity['id'],
  privyAddresses: Address[],
) => {
  const entityWallets = await getWalletsByEntityId(db, entityId)
  await updateExistingPrivyWallets(db, entityWallets, privyAddresses)
  return addNewPrivyWallets(db, entityId, entityWallets, privyAddresses)
}

/**
 * Handles unlinking privy wallets that are no longer linked to the privy account and re-linking wallets
 * that were previously unlinked from the privy account.
 */
const updateExistingPrivyWallets = async (
  db: Database,
  entityWallets: Wallet[],
  privyAddresses: string[],
) => {
  return Promise.all(
    entityWallets.map((entityWallet) => {
      if (entityWallet.linkType !== LinkType.PRIVY) {
        return Promise.resolve({})
      }

      if (
        entityWallet.state === WalletState.ACTIVE &&
        !privyAddresses.includes(entityWallet.address)
      ) {
        return updateWallet(db, entityWallet.id, {
          state: WalletState.UNLINKED,
          unlinkedAt: new Date(),
        })
      }

      if (
        entityWallet.state === WalletState.UNLINKED &&
        privyAddresses.includes(entityWallet.address)
      ) {
        return updateWallet(db, entityWallet.id, {
          state: WalletState.ACTIVE,
          unlinkedAt: null,
        })
      }

      return Promise.resolve({})
    }),
  )
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
        entityWallets.find(
          (entityWallet) => entityWallet.address === privyAddress,
        )
      ) {
        return Promise.resolve({})
      }

      return insertWallet(db, {
        entityId,
        address: privyAddress,
        state: WalletState.ACTIVE,
        linkType: LinkType.PRIVY,
      })
    }),
  )
}
