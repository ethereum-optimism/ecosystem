import type { Context } from 'hono'
import { z } from 'zod'

import * as walletService from '../services/wallet.js'

const userIdSchema = z.object({
  userId: z.string().min(1, 'User ID is required').trim(),
})

function createValidationError(c: Context, error: z.ZodError) {
  return c.json(
    {
      error: 'Invalid parameters',
      details: error.format(),
    },
    400,
  )
}

function validateUserParams(c: Context) {
  const params = c.req.param()
  const result = userIdSchema.safeParse(params)
  if (!result.success) {
    return {
      error: createValidationError(c, result.error),
      data: null,
    }
  }
  return { error: null, data: result.data }
}

export class WalletController {
  async createWallet(c: Context) {
    try {
      // Validate userId parameter
      const validation = validateUserParams(c)
      if (validation.error) return validation.error

      const { userId } = validation.data
      const wallet = await walletService.createWallet(userId)

      return c.json({
        message: 'Wallet created successfully',
        address: wallet.address,
        userId,
      })
    } catch (error) {
      return c.json(
        {
          error: 'Failed to create wallet',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        500,
      )
    }
  }

  async getWallet(c: Context) {
    try {
      const validation = validateUserParams(c)
      if (validation.error) return validation.error

      const { userId } = validation.data
      const wallet = await walletService.getWallet(userId)

      if (!wallet) {
        return c.json(
          {
            error: 'Wallet not found',
            message: `No wallet found for user ${userId}`,
          },
          404,
        )
      }

      return c.json({
        message: 'Wallet retrieved successfully',
        address: wallet.address,
        userId,
      })
    } catch (error) {
      return c.json(
        {
          error: 'Failed to get wallet',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
        500,
      )
    }
  }
}
