import crypto from 'crypto'
import type { Logger } from 'pino'
import { z } from 'zod'

import type { Database } from '@/db/Database'
import type { ApiKey } from '@/models/apiKeys'
import {
  createApiKey,
  deleteApiKey,
  getApiKey,
  getApiKeyByKey,
  listApiKeysForEntity,
  updateApiKeyState,
} from '@/models/apiKeys'
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
        name: z.string().optional().nullable(),
        state: z
          .union([z.literal('enabled'), z.literal('disabled')])
          .optional()
          .default('disabled'),
        key: z
          .string()
          .min(10)
          .max(200)
          .optional()
          .default(() => crypto.randomUUID()),
      }),
    )
    .mutation(async ({ input }) => {
      const { entityId, name, state, key } = input

      let apiKey: ApiKey
      try {
        apiKey = await createApiKey(this.database, {
          entityId,
          state,
          key,
          name,
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

  public readonly updateApiKey = 'updateApiKey' as const
  public readonly updateApiKeyController = this.trpc.procedure
    .input(
      z.object({
        id: z.string(),
        state: z.union([z.literal('enabled'), z.literal('disabled')]),
      }),
    )
    .mutation(async ({ input }) => {
      let updatedApiKey: ApiKey | null
      try {
        updatedApiKey = await updateApiKeyState(
          this.database,
          input.id,
          input.state,
        )
      } catch (e) {
        throw this.logAndReturnDbError(e, 'Error updating API key state')
      }

      if (!updatedApiKey) {
        throw Trpc.handleStatus(404, 'API key not found')
      }

      return { updatedApiKey: updatedApiKey }
    })

  public readonly deleteApiKey = 'deleteApiKey' as const
  public readonly deleteApiKeyController = this.trpc.procedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await deleteApiKey(this.database, input.id)
      } catch (e) {
        throw this.logAndReturnDbError(e, 'Error deleting API key')
      }
    })

  // Right now, the endpoint is a simple check for "state" column of an API key
  // In the future, the verification process may be more resource intensive (verifying a signature, etc.)
  public readonly verifyApiKey = 'verifyApiKey' as const
  public readonly verifyApiKeyController = this.trpc.procedure
    .input(
      z.object({
        key: z.string(),
      }),
    )
    .query(async ({ input }) => {
      let apiKey: ApiKey | null
      try {
        apiKey = await getApiKeyByKey(this.database, input.key)
      } catch (e) {
        throw this.logAndReturnDbError(e, 'Error getting API key by key')
      }

      if (!apiKey || apiKey.state !== 'enabled') {
        return {
          apiKey: apiKey ? { id: apiKey.id } : null,
          isVerified: false,
        }
      }

      return {
        apiKey: { id: apiKey.id },
        isVerified: true,
      }
    })

  public readonly listApiKeysForEntity = 'listApiKeysForEntity' as const
  public readonly listApiKeysForEntityController = this.trpc.procedure
    .input(z.object({ entityId: z.string() }))
    .query(async ({ input }) => {
      let apiKeys: ApiKey[]
      try {
        apiKeys = await listApiKeysForEntity(this.database, input.entityId)
      } catch (e) {
        throw this.logAndReturnDbError(e, 'Error listing API keys for entityId')
      }
      return { apiKeys }
    })

  public readonly handler = this.trpc.router({
    [this.createApiKey]: this.createApiKeyController,
    [this.getApiKey]: this.getApiKeyController,
    [this.updateApiKey]: this.updateApiKeyController,
    [this.deleteApiKey]: this.deleteApiKeyController,
    [this.verifyApiKey]: this.verifyApiKeyController,
    [this.listApiKeysForEntity]: this.listApiKeysForEntityController,
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
