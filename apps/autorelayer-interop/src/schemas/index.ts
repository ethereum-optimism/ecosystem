import { isAddress, isHash, isHex } from 'viem'
import { z } from 'zod'

export const PendingClaimSchema = z.object({
  relayReceipt: z.object({
    messageHash: z.string().refine(isHex, 'invalid message hash'),
    origin: z.string().refine(isAddress, 'invalid origin'),
    blockNumber: z.coerce.bigint(),
    logIndex: z.coerce.bigint(),
    timestamp: z.coerce.bigint(),
    chainId: z.coerce.bigint(),
    logPayload: z.string().refine(isHex, 'invalid log payload'),
    gasProvider: z.string().refine(isAddress, 'invalid gas provider'),
    gasProviderChainId: z.coerce.bigint(),
    relayer: z.string().refine(isAddress, 'invalid relayer'),
    relayCost: z.coerce.bigint(),
    relayedAt: z.coerce.bigint(),
    nestedMessageHashes: z.array(
      z.string().refine(isHex, 'invalid nested message hash'),
    ),
  }),
})

export const PendingClaimsSchema = z.array(PendingClaimSchema)

export const PendingRelayCostForGasProviderSchema = z
  .object({
    gasProviderAddress: z
      .string()
      .refine(isAddress, 'invalid gas provider address'),
    gasProviderChainId: z.coerce.bigint(),
    totalPendingRelayCost: z.coerce.bigint(),
    pendingReceiptsCount: z.coerce.bigint(),
  })
  .nullable()

export const PendingMessageSchema = z.object({
  // Identifier
  messageHash: z.string().refine(isHex, 'invalid message hash'),
  // Message Direction
  source: z.coerce.bigint(),
  destination: z.coerce.bigint(),
  target: z.string().refine(isAddress, 'invalid target'),
  txOrigin: z.string().refine(isAddress, 'invalid transaction origin'),
  // ExecutingMessage
  logIndex: z.coerce.bigint(),
  logPayload: z.string().refine(isHex, 'invalid log payload'),
  timestamp: z.coerce.bigint(),
  blockNumber: z.coerce.bigint(),
  transactionHash: z.string().refine(isHash, 'invalid transaction hash'),
})

export const PendingMessagesSchema = z.array(PendingMessageSchema)

export const GasTankProviderSchema = z.object({
  gasTankChainId: z.coerce.bigint(),
  gasProviderBalance: z.coerce.bigint(),
  gasProviderAddress: z
    .string()
    .refine(isAddress, 'invalid gas provider address'),
  pendingWithdrawal: z
    .object({
      amount: z.coerce.bigint(),
      initiatedAt: z.coerce.bigint(),
    })
    .optional(),
})

export const PendingMessageWithGasTankSchema = PendingMessageSchema.extend({
  gasTankProviders: z.array(GasTankProviderSchema),
})

export const PendingMessagesWithGasTankSchema = z.array(
  PendingMessageWithGasTankSchema,
)
