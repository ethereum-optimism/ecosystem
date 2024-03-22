import {
  index,
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import type { Address } from 'viem'

import { apps } from './apps'
import { entities } from './entities'

enum ContractState {
  NOT_VERIFIED = 'not_verified',
  VERIFIED = 'verified',
}

export const contracts = pgTable(
  'contracts',
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
    chainId: integer('chain_id'),
    appId: uuid('app_id')
      .references(() => apps.id)
      .notNull(),
    name: varchar('name').notNull(),
    contractAddress: varchar('contract_address').$type<Address>(),
    deployerAddress: varchar('deployer_address').$type<Address>(),
    state: varchar('state')
      .$type<ContractState>()
      .default(ContractState.NOT_VERIFIED)
      .notNull(),
  },
  (table) => {
    return {
      entityIdx: index().on(table.entityId),
      appIdx: index().on(table.appId),
      contractAddressIdx: index().on(table.contractAddress),
      deployerAddress: index().on(table.deployerAddress),
    }
  },
)
