import {
  index,
  jsonb,
  numeric,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

const UINT256_PRECISION = 78

type ProviderType = 'alchemy'

type AlchemyProviderMetadata = {
  policyId: string
}

type ProviderMetadata = AlchemyProviderMetadata

export const sponsorshipPolicies = pgTable(
  'sponsorship-policies',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    apiKeyId: uuid('api_key_id').notNull(),
    chainId: numeric('chain_id', {
      precision: UINT256_PRECISION,
      scale: 0,
    }).notNull(),
    providerType: varchar('provider_type').$type<ProviderType>().notNull(),
    providerMetadata: jsonb('provider_metadata')
      .$type<ProviderMetadata>()
      .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      apiKeyIdIdx: uniqueIndex().on(table.apiKeyId), // one policy per api key
      chainIdIdx: index().on(table.chainId),
    }
  },
)
