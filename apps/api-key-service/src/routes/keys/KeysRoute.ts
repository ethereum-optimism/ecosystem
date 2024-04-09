import crypto from 'crypto'
import type { Logger } from 'pino'
import { z } from 'zod'

import type { Database } from '@/db/Database'
import type { ApiKey } from '@/models/apiKeys'
import { createApiKey, getApiKey } from '@/models/apiKeys'
import type { Metrics } from '@/monitoring/metrics'
import { Route } from '@/routes/Route'
import { Trpc } from '@/Trpc'

export class KeysRoute extends Route {
  public readonly name = 'keys' as const

  public readonly createApiKey = 'createApiKey' as const
  public readonly createApiKeyController = this.trpc.procedure
    .input(
      z.object({
        entityId: z.string(),
        state: z
          .union([z.literal('enabled'), z.literal('disabled')])
          .optional()
          .default('disabled'),
        key: z
          .string()
          .min(10)
          .max(200)
          .optional()
          .default(crypto.randomUUID()),
      }),
    )
    .mutation(async ({ input }) => {
      const { entityId, state, key } = input

      let apiKey: ApiKey
      try {
        apiKey = await createApiKey(this.database, {
          entityId,
          state,
          key,
        })
        this.metrics.generatedApiKeysCount.inc()
      } catch (e) {
        throw this.logAndReturnDbError(e, 'Error creating API key')
      }

      return { apiKey }
    })

  public readonly getApiKey = 'getApiKey' as const
  public readonly getApiKeyController = this.trpc.procedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      let apiKey: ApiKey | null
      try {
        apiKey = await getApiKey(this.database, input.id)
      } catch (e) {
        throw this.logAndReturnDbError(e, 'Error getting API key')
      }

      return { apiKey }
    })

  public readonly handler = this.trpc.router({
    [this.createApiKey]: this.createApiKeyController,
    [this.getApiKey]: this.getApiKeyController,
  })

  constructor(
    trpc: Trpc,
    logger: Logger,
    metrics: Metrics,
    private readonly database: Database,
  ) {
    super(trpc, logger, metrics)
  }

  logAndReturnDbError(e: Error, message: string) {
    this.logger.error(e, message)
    this.metrics.dbCallFailureCount.inc()
    return Trpc.handleStatus(500, message)
  }
}
