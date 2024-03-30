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
import { getAddress, isAddress } from 'viem'

import type { Database } from '@/db'

import type { Entity } from './entities'
import { entities } from './entities'

export enum WalletState {
  ACTIVE = 'active',
  UNLINKED = 'unlinked',
}

export enum WalletLinkType {
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
    /** Address should always be stored in checksummed format. */
    address: varchar('address').$type<Address>().notNull(),
    linkType: varchar('link_type')
      .$type<WalletLinkType>()
      .default(WalletLinkType.PRIVY)
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
  if (!isAddress(newWallet.address, { strict: true })) {
    throw new Error('address is invalid')
  }

  const checksummedWallet = {
    ...newWallet,
    // Ensures that all addresses in the db are stored in checksummed format.
    address: getAddress(newWallet.address),
  }
  const result = await db.insert(wallets).values(checksummedWallet).returning()

  return result[0]
}

export const updateWallet = async (
  db: Database,
  walletId: Wallet['id'],
  update: UpdateWallet,
) => {
  return db.update(wallets).set(update).where(eq(wallets.id, walletId))
}
