import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { and, eq, ne } from 'drizzle-orm'
import {
  index,
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { type Address, getAddress } from 'viem'

import type { Database } from '@/db'

import { contracts } from './contracts'
import { entities } from './entities'

export enum ChallengeState {
  PENDING = 'pending',
  VERIFIED = 'verified',
  EXPIRED = 'expired',
}

export const challenges = pgTable(
  'challenges',
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
    chainId: integer('chain_id').notNull(),
    contractId: uuid('contract_id')
      .references(() => contracts.id)
      .notNull(),
    /** Address that has to complete the challenge */
    address: varchar('address').$type<Address>().notNull(),
    state: varchar('state')
      .$type<ChallengeState>()
      .default(ChallengeState.PENDING)
      .notNull(),
  },
  (table) => {
    return {
      entityIdx: index().on(table.entityId),
      contractIdx: index().on(table.contractId),
      addressIdx: index().on(table.address),
      entityIdAddressIdx: index().on(table.entityId, table.address),
    }
  },
)

export type Challenge = InferSelectModel<typeof challenges>
export type InsertChallenge = InferInsertModel<typeof challenges>

export const getUnexpiredChallenge = async (input: {
  db: Database
  contractId: Challenge['contractId']
  entityId: Challenge['entityId']
}): Promise<Challenge | null> => {
  const { db, contractId, entityId } = input

  const results = await db
    .select()
    .from(challenges)
    .where(
      and(
        eq(challenges.contractId, contractId),
        eq(challenges.entityId, entityId),
        ne(challenges.state, ChallengeState.EXPIRED),
      ),
    )

  return results[0] || null
}

export const getChallengeByChallengeId = async (input: {
  db: Database
  challengeId: Challenge['id']
  entityId: Challenge['entityId']
}): Promise<Challenge | null> => {
  const { db, challengeId, entityId } = input

  const results = await db
    .select()
    .from(challenges)
    .where(
      and(eq(challenges.id, challengeId), eq(challenges.entityId, entityId)),
    )

  return results[0] || null
}

export const insertChallenge = async (input: {
  db: Database
  challenge: InsertChallenge
}) => {
  const { db, challenge } = input

  const normalizedChallenge = {
    ...challenge,
    address: getAddress(challenge.address),
  }
  const results = await db
    .insert(challenges)
    .values(normalizedChallenge)
    .returning()

  return results[0]
}

export const completeChallenge = async (input: {
  db: Database
  challengeId: Challenge['id']
  entityId: Challenge['entityId']
}) => {
  const { db, challengeId, entityId } = input
  const results = await db
    .update(challenges)
    .set({ state: ChallengeState.VERIFIED, updatedAt: new Date() })
    .where(
      and(eq(challenges.entityId, entityId), eq(challenges.id, challengeId)),
    )
    .returning()

  return results[0]
}
