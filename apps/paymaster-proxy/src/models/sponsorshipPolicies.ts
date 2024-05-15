import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { desc, eq, inArray } from 'drizzle-orm'
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

import type { Database } from '@/db/Database'

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

type InsertSponsorshipPolicy = InferInsertModel<typeof sponsorshipPolicies>

export type SponsorshipPolicy = InferSelectModel<typeof sponsorshipPolicies>

export const createSponsorshipPolicy = async (
  db: Database,
  sponsorshipPolicy: InsertSponsorshipPolicy,
) => {
  const result = await db
    .insert(sponsorshipPolicies)
    .values(sponsorshipPolicy)
    .returning()

  return result[0]
}

export const getSponsorshipPolicy = async (db: Database, id: string) => {
  const policies = await db
    .select()
    .from(sponsorshipPolicies)
    .where(eq(sponsorshipPolicies.id, id))

  if (policies.length === 0) {
    return null
  }

  // guaranteed to only be 1 max because of the unique index on apiKeyId
  return policies[0]
}

export const deleteSponsorshipPolicy = async (db: Database, id: string) => {
  await db.delete(sponsorshipPolicies).where(eq(sponsorshipPolicies.id, id))
}

export const getSponsorshipPolicyForApiKeyId = async (
  db: Database,
  apiKeyId: string,
) => {
  const policies = await db
    .select()
    .from(sponsorshipPolicies)
    .where(eq(sponsorshipPolicies.apiKeyId, apiKeyId))

  if (policies.length === 0) {
    return null
  }

  // guaranteed to only be 1 max because of the unique index on apiKeyId
  return policies[0]
}

export const listSponsorshipPoliciesForApiKeyIds = async (
  db: Database,
  apiKeyIds: string[],
) => {
  return await db
    .select()
    .from(sponsorshipPolicies)
    .where(inArray(sponsorshipPolicies.apiKeyId, apiKeyIds))
    .orderBy(desc(sponsorshipPolicies.createdAt))
    .limit(1000)
}
