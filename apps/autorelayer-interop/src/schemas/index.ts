import { isAddress, isHash, isHex } from 'viem'
import { z } from 'zod'

export const PendingClaimSchema = z.object({
  relayReceipt: z.object({
    messageHash: z.string().refine(isHex, 'invalid message hash'),
    origin: z.string().refine(isAddress, 'invalid origin'),
    blockNumber: z.number(),
    logIndex: z.number(),
    timestamp: z.number(),
    chainId: z.number(),
    logPayload: z.string().refine(isHex, 'invalid log payload'),
    gasProvider: z.string().refine(isAddress, 'invalid gas provider'),
    gasProviderChainId: z.number(),
    relayer: z.string().refine(isAddress, 'invalid relayer'),
    relayCost: z.number(),
    relayedAt: z.number(),
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
    gasProviderChainId: z.number(),
    totalPendingRelayCost: z.coerce.number(),
    pendingReceiptsCount: z.number(),
  })
  .nullable()

export const PendingMessageSchema = z.object({
  // Identifier
  messageHash: z.string().refine(isHex, 'invalid message hash'),
  // Message Direction
  source: z.number(),
  destination: z.number(),
  target: z.string().refine(isAddress, 'invalid target'),
  txOrigin: z.string().refine(isAddress, 'invalid transaction origin'),
  // ExecutingMessage
  logIndex: z.number(),
  logPayload: z.string().refine(isHex, 'invalid log payload'),
  timestamp: z.number(),
  blockNumber: z.number(),
  transactionHash: z.string().refine(isHash, 'invalid transaction hash'),
})

export const PendingMessagesSchema = z.array(PendingMessageSchema)

export const GasTankProviderSchema = z.object({
  gasTankChainId: z.number(),
  gasProviderBalance: z.number(),
  gasProviderAddress: z
    .string()
    .refine(isAddress, 'invalid gas provider address'),
  pendingWithdrawal: z
    .object({
      amount: z.number(),
      initiatedAt: z.number(),
    })
    .optional(),
})

export const PendingMessageWithGasTankSchema = PendingMessageSchema.extend({
  gasTankProviders: z.array(GasTankProviderSchema),
})

export const PendingMessagesWithGasTankSchema = z.array(
  PendingMessageWithGasTankSchema,
)
