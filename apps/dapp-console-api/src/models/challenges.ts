import {
  index,
  jsonb,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import type { Address, Hex } from 'viem'

import { contracts } from './contracts'
import { entities } from './entities'

type Challenge = {
  message: string
}

type ChallengeResponse = {
  signature: Hex
}

enum ChallengeState {
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
    contractId: uuid('contract_id')
      .references(() => contracts.id)
      .notNull(),
    /** Address that has to complete the challenge */
    address: varchar('address').$type<Address>().notNull(),
    state: varchar('state')
      .$type<ChallengeState>()
      .default(ChallengeState.PENDING)
      .notNull(),
    /** Challenge is null if the entity has already completed a challenge for the address */
    challenge: jsonb('challenge').$type<Challenge>(),
    response: jsonb('reponse').$type<ChallengeResponse>(),
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
