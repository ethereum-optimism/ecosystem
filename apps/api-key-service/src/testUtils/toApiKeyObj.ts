import crypto from 'crypto'

import type { ApiKey } from '@/models/apiKeys'

// test helper function to return a full ApiKey object, fills in missing fields with random values
export const toApiKeyObj = (partialApiKey: Partial<ApiKey>): ApiKey => {
  return {
    id: partialApiKey.id ?? crypto.randomUUID(),
    entityId: partialApiKey.entityId ?? crypto.randomUUID(),
    key: partialApiKey.key ?? crypto.randomUUID(),
    state: partialApiKey.state ?? 'disabled',
    createdAt: partialApiKey.createdAt ?? new Date(),
    updatedAt: partialApiKey.updatedAt ?? new Date(),
    stateUpdatedAt: partialApiKey.stateUpdatedAt ?? null,
    deletedAt: partialApiKey.deletedAt ?? null,
  }
}
