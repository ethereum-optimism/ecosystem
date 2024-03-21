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

import { entities } from './entities'

enum AddressState {
  ACTIVE = 'active',
  DISABLED = 'disabled',
  SANCTIONED = 'sanctioned',
}

type AddressVerification = {}

export const addresses = pgTable(
  'addresses',
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
    verifications: jsonb('verifications')
      .$type<AddressVerification>()
      .default({})
      .notNull(),
    state: varchar('state')
      .$type<AddressState>()
      .default(AddressState.ACTIVE)
      .notNull(),
  },
  (table) => {
    return {
      entityIdAddressIdx: uniqueIndex().on(table.entityId, table.address),
      entityIdx: index().on(table.entityId),
      addressIdx: index().on(table.address),
    }
  },
)
