import { Address } from 'abitype/zod'
import type { Hash } from 'viem'
import { isHex } from 'viem'
import type { ZodObject } from 'zod'
import { z } from 'zod'

import { SUPPORTED_CHAINS } from '@/constants'

export const zodCreatedAtCursor = z.object({
  createdAt: z.date(),
  id: z.string(),
})

export const zodNameCursor = z.object({
  name: z.string(),
  id: z.string(),
})

export const zodListRequest = <Cursor extends ZodObject<{}>>(
  cursor: Cursor,
  limit?: number,
) =>
  z.object({
    cursor: cursor.optional(),
    limit: z
      .number()
      .min(0)
      .max(limit ?? 100)
      .optional(),
  })

export const zodEthereumAddress = Address

export const zodEthereumTransactionHash = z
  .custom<Hash>()
  .refine((arg) => isHex(arg, { strict: true }), {
    message: 'Invalid transaction hash',
  })
  .describe('Any valid ethereum transaction hash')

export const zodEthereumSignature = z
  .custom<Hash>()
  .refine((arg) => isHex(arg, { strict: true }), {
    message: 'Invalid signature',
  })
  .describe('Any valid ethereum signature')

export const zodSupportedChainId = z
  .number()
  .refine((chainId) =>
    SUPPORTED_CHAINS.some(({ chain }) => chain.id === chainId),
  )
