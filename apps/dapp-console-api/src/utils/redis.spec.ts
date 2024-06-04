import type { SpyInstance } from 'vitest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { parseRedisConnectionString, RedisCache } from './redis'

vi.mock('ioredis')

describe('redis helper', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('parseRedisConnectionString', () => {
    it('should correctly parse redis connections string', () => {
      const expectedProtocol = 'redis'
      const expectedHost = '0.0.0.0'
      const expectedPort = 6379

      const { protocol, host, port } = parseRedisConnectionString(
        `${expectedProtocol}://${expectedHost}:${expectedPort}`,
      )

      expect(protocol).toBe(expectedProtocol)
      expect(host).toBe(expectedHost)
      expect(port).toBe(expectedPort)
    })
  })

  describe('RedisCache', () => {
    const testKey = 'test'
    const redisCache = new RedisCache('redis://redis-app:6739')

    describe('#setItem', () => {
      let mockSetKey: SpyInstance
      beforeEach(() => {
        mockSetKey = vi
          .spyOn(redisCache.redisClient, 'set')
          .mockImplementation(() => Promise.resolve('OK'))
      })

      it('should save bigints', async () => {
        const res = await redisCache.setItem<bigint>({
          key: testKey,
          value: BigInt(100),
        })
        expect(res).toBeTruthy()
        expect(mockSetKey).toBeCalledWith(
          testKey,
          JSON.stringify({ type: 'bigint', value: `100` }),
        )
      })

      it('should save booleans', async () => {
        let res = await redisCache.setItem<boolean>({
          key: testKey,
          value: true,
        })
        expect(res).toBeTruthy()
        expect(mockSetKey).toBeCalledWith(
          testKey,
          JSON.stringify({ type: 'boolean', value: `true` }),
        )

        res = await redisCache.setItem<boolean>({ key: testKey, value: false })
        expect(res).toBeTruthy()
        expect(mockSetKey).toBeCalledWith(
          testKey,
          JSON.stringify({ type: 'boolean', value: `false` }),
        )
      })

      it('should save numbers', async () => {
        const res = await redisCache.setItem<number>({
          key: testKey,
          value: 300,
        })
        expect(res).toBeTruthy()
        expect(mockSetKey).toBeCalledWith(
          testKey,
          JSON.stringify({ type: 'number', value: `300` }),
        )
      })

      it('should save objects', async () => {
        const hash = { test: 'thisisatest' }
        const res = await redisCache.setItem<object>({
          key: testKey,
          value: hash,
        })
        expect(res).toBeTruthy()
        expect(mockSetKey).toBeCalledWith(
          testKey,
          JSON.stringify({ type: 'object', value: JSON.stringify(hash) }),
        )
      })

      it('should save strings', async () => {
        const str = 'str'
        const res = await redisCache.setItem<string>({
          key: testKey,
          value: str,
        })
        expect(res).toBeTruthy()
        expect(mockSetKey).toBeCalledWith(
          testKey,
          JSON.stringify({ type: 'string', value: str }),
        )
      })

      it('should save with ttl', async () => {
        const str = 'str'
        const ttl = 100
        const mockExpire = vi
          .spyOn(redisCache.redisClient, 'expire')
          .mockImplementation(() => Promise.resolve(ttl))
        const res = await redisCache.setItem<string>({
          key: testKey,
          value: str,
          ttlInSeconds: ttl,
        })
        expect(res).toBeTruthy()
        expect(mockSetKey).toBeCalledWith(
          testKey,
          JSON.stringify({ type: 'string', value: str }),
        )
        expect(mockExpire).toBeCalledWith(testKey, ttl)
      })

      it('should throw an error when unable to set key', async () => {
        const str = 'str'
        vi.spyOn(redisCache.redisClient, 'set').mockImplementation(() =>
          Promise.resolve(null),
        )
        await expect(
          redisCache.setItem<string>({
            key: testKey,
            value: str,
          }),
        ).rejects.toThrowError()
      })
    })

    describe('#getItem', () => {
      it('should get bigints', async () => {
        vi.spyOn(redisCache.redisClient, 'get').mockImplementation(() => {
          return Promise.resolve(
            JSON.stringify({ type: 'bigint', value: '100' }),
          )
        })
        const res = await redisCache.getItem<bigint>(testKey)
        expect(res).toEqual(BigInt(100))
      })

      it('should get booleans', async () => {
        vi.spyOn(redisCache.redisClient, 'get').mockImplementation(() => {
          return Promise.resolve(
            JSON.stringify({ type: 'boolean', value: 'true' }),
          )
        })
        const res = await redisCache.getItem<boolean>(testKey)
        expect(res).toEqual(true)
      })

      it('should get numbers', async () => {
        vi.spyOn(redisCache.redisClient, 'get').mockImplementation(() => {
          return Promise.resolve(JSON.stringify({ type: 'number', value: '1' }))
        })
        const res = await redisCache.getItem<number>(testKey)
        expect(res).toEqual(1)
      })

      it('should get objects', async () => {
        const test = { test: 'thisisatest' }
        vi.spyOn(redisCache.redisClient, 'get').mockImplementation(() => {
          return Promise.resolve(
            JSON.stringify({ type: 'object', value: JSON.stringify(test) }),
          )
        })
        const res = await redisCache.getItem<object>(testKey)
        expect(res).toEqual(test)
      })

      it('should get strings', async () => {
        vi.spyOn(redisCache.redisClient, 'get').mockImplementation(() => {
          return Promise.resolve(
            JSON.stringify({ type: 'string', value: 'str' }),
          )
        })
        const res = await redisCache.getItem<string>(testKey)
        expect(res).toEqual('str')
      })
    })
  })
})
