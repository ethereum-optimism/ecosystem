import type {
  ExtractTablesWithRelations,
  InferInsertModel,
  InferSelectModel,
} from 'drizzle-orm'
import { and, eq, relations } from 'drizzle-orm'
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

import type { CreatedAtCursor } from '@/api'
import type { Database } from '@/db'

import type { Entity } from './entities'
import { entities } from './entities'
import type * as schema from './schema'
import { generateCursorSelect } from './utils'

export enum WalletState {
  ACTIVE = 'active',
  UNLINKED = 'unlinked',
}

export enum WalletLinkType {
  PRIVY = 'privy',
}

type AddressVerifications = {
  isCbVerified?: boolean
}

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
      .$type<AddressVerifications>()
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
      createdAtIdx: index().on(table.createdAt),
      entityIdx: index().on(table.entityId),
      addressIdx: index().on(table.address),
    }
  },
)

export const walletsRelations = relations(wallets, ({ one }) => ({
  entity: one(entities),
}))

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

export const getActiveWalletsForEntityByCursor = async (
  db: Database,
  entityId: Entity['id'],
  limit: number,
  cursor?: CreatedAtCursor,
) => {
  return generateCursorSelect<
    typeof wallets,
    ExtractTablesWithRelations<typeof schema>['wallets'],
    ExtractTablesWithRelations<typeof schema>,
    typeof db.query.apps,
    'createdAt',
    'id',
    {}
  >({
    queryBuilder: db.query.wallets,
    withSelector: {},
    table: wallets,
    filters: [
      eq(wallets.entityId, entityId),
      eq(wallets.state, WalletState.ACTIVE),
    ],
    limit,
    orderBy: { direction: 'desc', column: 'createdAt' },
    idColumnKey: 'id',
    cursor,
  })
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

export const updateWallet = async (input: {
  db: Database
  entityId: Wallet['entityId']
  walletId: Wallet['id']
  update: UpdateWallet
}) => {
  const { db, walletId, entityId, update } = input
  return db
    .update(wallets)
    .set({ ...update, updatedAt: new Date() })
    .where(and(eq(wallets.id, walletId), eq(wallets.entityId, entityId)))
}

export const getWalletVerifications = async (input: {
  db: Database
  entityId: Wallet['entityId']
}) => {
  const { db, entityId } = input
  const entityWallets = await db
    .select()
    .from(wallets)
    .where(
      and(
        eq(wallets.entityId, entityId),
        eq(wallets.state, WalletState.ACTIVE),
      ),
    )

  return {
    cbVerifiedWallets: entityWallets.filter(
      (wallet) => !!wallet.verifications.isCbVerified,
    ),
  }
}
