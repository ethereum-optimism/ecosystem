import type { z } from 'zod'

import type { GasTankProviderSchema, PendingClaimSchema, PendingClaimsSchema, PendingMessageSchema,PendingMessagesSchema,PendingMessagesWithGasTankSchema,PendingMessageWithGasTankSchema, PendingRelayCostForGasProviderSchema } from '@/schemas/index.js'

export type PendingClaim = z.infer<typeof PendingClaimSchema>

export type PendingClaims = z.infer<typeof PendingClaimsSchema>

export type PendingRelayCostForGasProvider = z.infer<
  typeof PendingRelayCostForGasProviderSchema
>

export type PendingMessage = z.infer<typeof PendingMessageSchema>

export type PendingMessages = z.infer<typeof PendingMessagesSchema>

export type GasTankProvider = z.infer<typeof GasTankProviderSchema>

export type PendingMessageWithGasTank = z.infer<
  typeof PendingMessageWithGasTankSchema
>

export type PendingMessagesWithGasTank = z.infer<
  typeof PendingMessagesWithGasTankSchema
>
