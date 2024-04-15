import { createCallerFactory } from '@trpc/server'
import crypto from 'crypto'
import type e from 'express'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createApiKey, getApiKey } from '@/models/apiKeys'
import { metrics } from '@/monitoring/metrics'
import { KeysRoute } from '@/routes/keys/KeysRoute'
import { createRandomString } from '@/testUtils/createRandomString'
import { mockDb } from '@/testUtils/mockDb'
import { mockLogger } from '@/testUtils/mockLogger'
import { toApiKeyObj } from '@/testUtils/toApiKeyObj'
import { uuidRegex } from '@/testUtils/uuidRegex'
import { Trpc } from '@/Trpc'

vi.mock('@/models/apiKeys', () => ({
  getApiKey: vi.fn(async (db, id) => {
    return toApiKeyObj({ id })
  }),
  createApiKey: vi.fn(async (db, newApiKey) => {
    return toApiKeyObj(newApiKey)
  }),
}))

describe(KeysRoute.name, () => {
  const mockedCreateApiKey = vi.mocked(createApiKey)
  const mockedGetApiKey = vi.mocked(getApiKey)

  const trpc = new Trpc()

  const route = new KeysRoute(trpc, mockLogger, metrics, mockDb)

  const callerFactory = createCallerFactory()
  const createCaller = callerFactory(route.handler)
  const caller = createCaller({
    req: {} as e.Request,
    res: {} as e.Response,
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createApiKey', () => {
    it('rejects if entityId is missing', async () => {
      await expect(
        // @ts-expect-error - testing invalid input
        caller.createApiKey({
          state: 'enabled',
        }),
      ).rejects.toThrowError(/invalid_type/)
    })

    it('uses default disabled state if state is unspecified', async () => {
      const createApiKeyParams = {
        entityId: crypto.randomUUID(),
        key: 'test-api-key-0',
      }

      const apiKeyObj = toApiKeyObj(createApiKeyParams)

      mockedCreateApiKey.mockResolvedValueOnce(apiKeyObj)

      const resopnse = await caller.createApiKey(createApiKeyParams)

      expect(mockedCreateApiKey).toHaveBeenCalledOnce()

      expect(mockedCreateApiKey.mock.calls[0][1]).toMatchObject({
        ...createApiKeyParams,
        state: 'disabled',
      })

      expect(resopnse).toMatchObject({ apiKey: apiKeyObj })
    })

    it('rejects empty string key', async () => {
      await expect(
        caller.createApiKey({
          entityId: crypto.randomUUID(),
          state: 'disabled',
          key: '',
        }),
      ).rejects.toThrowError(/too_small/)
    })

    it('rejects < 10 string key', async () => {
      await expect(
        caller.createApiKey({
          entityId: crypto.randomUUID(),
          state: 'disabled',
          key: createRandomString(5),
        }),
      ).rejects.toThrowError(/too_small/)
    })

    it('rejects > 200 length key', async () => {
      await expect(
        caller.createApiKey({
          entityId: crypto.randomUUID(),
          state: 'disabled',
          key: createRandomString(201),
        }),
      ).rejects.toThrowError(/too_big/)
    })

    it('uses random key if key is unspecified', async () => {
      const createApiKeyParams = {
        entityId: crypto.randomUUID(),
        state: 'disabled',
      } as const

      const response = await caller.createApiKey(createApiKeyParams)

      expect(mockedCreateApiKey).toHaveBeenCalledOnce()

      expect(mockedCreateApiKey.mock.calls[0][1]).toMatchObject(
        createApiKeyParams,
      )

      expect(response).toMatchObject({ apiKey: createApiKeyParams })
      expect(response.apiKey.key).toMatch(uuidRegex)
    })

    it('errors with INTERNAL_SERVER_ERROR if db insert fails', async () => {
      const createApiKeyParams = {
        entityId: crypto.randomUUID(),
        state: 'disabled',
        key: 'test-api-key-0',
      } as const

      mockedCreateApiKey.mockRejectedValueOnce(new Error('some db error'))

      await expect(
        caller.createApiKey(createApiKeyParams),
      ).rejects.toThrowError('Internal server error')
    })
  })

  describe('getApiKey', () => {
    it('rejects if id is missing', async () => {
      await expect(
        // @ts-expect-error - testing invalid input
        caller.createApiKey({}),
      ).rejects.toThrowError(/invalid_type/)
    })

    it('returns null if key doesnt exist', async () => {
      mockedGetApiKey.mockResolvedValueOnce(null)

      const response = await caller.getApiKey({ id: crypto.randomUUID() })

      expect(response).toMatchObject({ apiKey: null })
    })

    it('errors with INTERNAL_SERVER_ERROR if db select fails', async () => {
      mockedGetApiKey.mockRejectedValueOnce(new Error('some db error'))

      await expect(
        caller.getApiKey({ id: crypto.randomUUID() }),
      ).rejects.toThrowError('Internal server error')
    })

    it('returns api key object', async () => {
      const apiKeyObject = toApiKeyObj({ id: crypto.randomUUID() })
      mockedGetApiKey.mockResolvedValueOnce(apiKeyObject)

      const response = await caller.getApiKey({ id: apiKeyObject.id })

      expect(response).toMatchObject({ apiKey: apiKeyObject })
    })
  })
})
