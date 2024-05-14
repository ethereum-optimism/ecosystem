import { createCallerFactory } from '@trpc/server'
import crypto from 'crypto'
import type e from 'express'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { ApiKeyState } from '@/models/apiKeys'
import {
  createApiKey,
  deleteApiKey,
  getApiKey,
  getApiKeyByKey,
  listApiKeysForEntity,
  updateApiKeyState,
} from '@/models/apiKeys'
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
  updateApiKeyState: vi.fn(
    async (db, id: string, newApiKeyState: ApiKeyState) =>
      toApiKeyObj({ id, state: newApiKeyState }),
  ),
  getApiKeyByKey: vi.fn(async (db, key) => toApiKeyObj({ key })),

  deleteApiKey: vi.fn(async () => {}),
  listApiKeysForEntity: vi.fn(),
}))

describe(KeysRoute.name, () => {
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
    const mockedCreateApiKey = vi.mocked(createApiKey)

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

      expect(resopnse).toEqual({ apiKey: apiKeyObj })
    })

    it('accepts null name', async () => {
      const createApiKeyParams = {
        entityId: crypto.randomUUID(),
        key: 'test-api-key-0',
        name: null,
      }

      const apiKeyObj = toApiKeyObj(createApiKeyParams)

      mockedCreateApiKey.mockResolvedValueOnce(apiKeyObj)

      const resopnse = await caller.createApiKey(createApiKeyParams)

      expect(mockedCreateApiKey).toHaveBeenCalledOnce()

      expect(mockedCreateApiKey.mock.calls[0][1]).toMatchObject({
        ...createApiKeyParams,
        state: 'disabled',
      })

      expect(resopnse).toEqual({ apiKey: apiKeyObj })
    })

    it('happy path', async () => {
      const createApiKeyParams = {
        entityId: crypto.randomUUID(),
        key: 'test-api-key-0',
        name: 'something',
      }

      const apiKeyObj = toApiKeyObj(createApiKeyParams)

      mockedCreateApiKey.mockResolvedValueOnce(apiKeyObj)

      const resopnse = await caller.createApiKey(createApiKeyParams)

      expect(mockedCreateApiKey).toHaveBeenCalledOnce()

      expect(mockedCreateApiKey.mock.calls[0][1]).toMatchObject({
        ...createApiKeyParams,
        state: 'disabled',
      })

      expect(resopnse).toEqual({ apiKey: apiKeyObj })
    })

    it('rejects non string name', async () => {
      await expect(
        caller.createApiKey({
          entityId: crypto.randomUUID(),
          state: 'disabled',
          // @ts-expect-error - testing invalid input
          name: 123,
        }),
      ).rejects.toThrowError(/invalid_type/)
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
    const mockedGetApiKey = vi.mocked(getApiKey)

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

  describe('updateApiKey', () => {
    const mockedUpdateApiKeyState = vi.mocked(updateApiKeyState)

    it('rejects if id is missing', async () => {
      await expect(
        // @ts-expect-error - testing invalid input
        caller.updateApiKey(),
      ).rejects.toThrowError(/invalid_type/)
      expect(mockedUpdateApiKeyState).not.toHaveBeenCalled()
    })

    it('rejects if state is missing', async () => {
      await expect(
        // @ts-expect-error - testing invalid input
        caller.updateApiKey({
          id: crypto.randomUUID(),
        }),
      ).rejects.toThrowError(/Invalid input/)
      expect(mockedUpdateApiKeyState).not.toHaveBeenCalled()
    })

    it('rejects if state is unsupported', async () => {
      await expect(
        caller.updateApiKey({
          id: crypto.randomUUID(),
          // @ts-expect-error - testing invalid input
          state: 'something-unsupported',
        }),
      ).rejects.toThrowError(/Invalid input/)
      expect(mockedUpdateApiKeyState).not.toHaveBeenCalled()
    })

    it('errors with INTERNAL_SERVER_ERROR if db update fails', async () => {
      const updateParams = {
        id: crypto.randomUUID(),
        state: 'enabled' as const,
      }
      mockedUpdateApiKeyState.mockRejectedValueOnce(new Error('some db error'))

      await expect(caller.updateApiKey(updateParams)).rejects.toThrowError(
        'Internal server error',
      )
      expect(mockedUpdateApiKeyState).toHaveBeenCalledOnce()
      expect(mockedUpdateApiKeyState).toHaveBeenCalledWith(
        mockDb,
        updateParams.id,
        updateParams.state,
      )
    })

    it('errors with NOT_FOUND if no rows are found', async () => {
      const updateParams = {
        id: crypto.randomUUID(),
        state: 'enabled' as const,
      }

      mockedUpdateApiKeyState.mockResolvedValueOnce(null)

      await expect(caller.updateApiKey(updateParams)).rejects.toThrowError(
        /Not found/,
      )

      expect(mockedUpdateApiKeyState).toHaveBeenCalledOnce()
      expect(mockedUpdateApiKeyState).toHaveBeenCalledWith(
        mockDb,
        updateParams.id,
        updateParams.state,
      )
    })

    it('updates and returns updated value', async () => {
      const updateParams = {
        id: crypto.randomUUID(),
        state: 'enabled' as const,
      }
      const updateApiKeyStateResponse = await caller.updateApiKey(updateParams)

      expect(mockedUpdateApiKeyState).toHaveBeenCalledOnce()
      expect(mockedUpdateApiKeyState).toHaveBeenCalledWith(
        mockDb,
        updateParams.id,
        updateParams.state,
      )

      expect(updateApiKeyStateResponse).toMatchObject({
        updatedApiKey: updateParams,
      })
    })
  })

  describe('deleteApiKey', async () => {
    const mockedDeleteApiKey = vi.mocked(deleteApiKey)

    it('rejects if id is missing', async () => {
      await expect(
        // @ts-expect-error - testing invalid input
        caller.deleteApiKey(),
      ).rejects.toThrowError(/invalid_type/)
    })

    it('errors with INTERNAL_SERVER_ERROR if db update fails', async () => {
      mockedDeleteApiKey.mockRejectedValueOnce(new Error('some db error'))

      await expect(
        caller.deleteApiKey({ id: crypto.randomUUID() }),
      ).rejects.toThrowError('Internal server error')
    })

    it('deletes key and returns nothing', async () => {
      const id = crypto.randomUUID()
      const result = await caller.deleteApiKey({ id })
      expect(mockedDeleteApiKey).toHaveBeenCalledOnce()
      expect(mockedDeleteApiKey).toHaveBeenCalledWith(mockDb, id)
      expect(result).toBeUndefined()
    })
  })

  describe('verifyApiKey', async () => {
    const mockedGetApiKeyByKey = vi.mocked(getApiKeyByKey)

    it('rejects if key is missing', async () => {
      await expect(
        // @ts-expect-error - testing invalid input
        caller.verifyApiKey(),
      ).rejects.toThrowError(/invalid_type/)
    })

    it('errors with INTERNAL_SERVER_ERROR if db select fails', async () => {
      mockedGetApiKeyByKey.mockRejectedValueOnce(new Error('some db error'))

      const key = crypto.randomUUID()

      await expect(caller.verifyApiKey({ key })).rejects.toThrowError(
        /Internal server error/,
      )

      expect(mockedGetApiKeyByKey).toHaveBeenCalledOnce()
      expect(mockedGetApiKeyByKey).toHaveBeenCalledWith(mockDb, key)
    })

    it('returns false if key is not found', async () => {
      const key = crypto.randomUUID()
      mockedGetApiKeyByKey.mockResolvedValueOnce(null)

      const response = await caller.verifyApiKey({ key })

      expect(response).toEqual({ isVerified: false, apiKey: null })

      expect(mockedGetApiKeyByKey).toHaveBeenCalledOnce()
      expect(mockedGetApiKeyByKey).toHaveBeenCalledWith(mockDb, key)
    })

    it('returns false if key is disabled', async () => {
      const id = crypto.randomUUID()
      const key = crypto.randomUUID()

      mockedGetApiKeyByKey.mockResolvedValueOnce(
        toApiKeyObj({ id, key, state: 'disabled' }),
      )

      const response = await caller.verifyApiKey({ key })

      expect(response).toEqual({ isVerified: false, apiKey: { id } })

      expect(mockedGetApiKeyByKey).toHaveBeenCalledOnce()
      expect(mockedGetApiKeyByKey).toHaveBeenCalledWith(mockDb, key)
    })

    it('returns true if key is enabled', async () => {
      const id = crypto.randomUUID()
      const key = crypto.randomUUID()

      mockedGetApiKeyByKey.mockResolvedValueOnce(
        toApiKeyObj({ id, key, state: 'enabled' }),
      )

      const response = await caller.verifyApiKey({ key })

      expect(response).toEqual({
        isVerified: true,
        apiKey: { id },
      })

      expect(mockedGetApiKeyByKey).toHaveBeenCalledOnce()
      expect(mockedGetApiKeyByKey).toHaveBeenCalledWith(mockDb, key)
    })
  })

  describe('listApiKeysForEntity', async () => {
    const mockedListApiKeysForEntity = vi.mocked(listApiKeysForEntity)
    it('rejects if input is missing', async () => {
      await expect(
        // @ts-expect-error - testing invalid input
        caller.listApiKeysForEntity(),
      ).rejects.toThrowError(/invalid_type/)

      expect(mockedListApiKeysForEntity).not.toHaveBeenCalled()
    })

    it('rejects if entityId is missing', async () => {
      await expect(
        // @ts-expect-error - testing invalid input
        caller.listApiKeysForEntity({}),
      ).rejects.toThrowError(/invalid_type/)
      expect(mockedListApiKeysForEntity).not.toHaveBeenCalled()
    })

    it('errors with INTERNAL_SERVER_ERROR if db select fails', async () => {
      const entityId = crypto.randomUUID()

      mockedListApiKeysForEntity.mockRejectedValueOnce(
        new Error('some db error'),
      )

      await expect(
        caller.listApiKeysForEntity({ entityId }),
      ).rejects.toThrowError(/Internal server error/)

      expect(mockedListApiKeysForEntity).toHaveBeenCalledOnce()
      expect(mockedListApiKeysForEntity).toHaveBeenCalledWith(mockDb, entityId)
    })

    it('returns list of keys', async () => {
      const entityId = crypto.randomUUID()

      const mockedResult = Array.from({ length: 3 }, () =>
        toApiKeyObj({ entityId }),
      )

      mockedListApiKeysForEntity.mockResolvedValueOnce(mockedResult)

      const listApiKeysForEntityResult = await caller.listApiKeysForEntity({
        entityId,
      })
      expect(listApiKeysForEntityResult).toEqual({
        apiKeys: mockedResult,
      })

      expect(mockedListApiKeysForEntity).toHaveBeenCalledOnce()
      expect(mockedListApiKeysForEntity).toHaveBeenCalledWith(mockDb, entityId)
    })
  })
})
