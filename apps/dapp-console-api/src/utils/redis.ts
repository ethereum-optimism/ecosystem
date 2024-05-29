import { Redis } from 'ioredis'

export type RedisTypes = string | number | bigint | boolean | object

export type RedisData = {
  type: string
  value: string
}

export type SetRedisItem<T extends RedisTypes> = {
  key: string
  value: T
  ttlInSeconds?: number
}

type RedisConnectionConfig = {
  protocol: string
  host: string
  port: number
}

export function parseRedisConnectionString(
  redisURL: string,
): RedisConnectionConfig {
  const [protocol, host, port] = redisURL.split(':')

  return {
    protocol: protocol.replace(':', ''),
    host: host.replace('//', ''),
    port: Number(port),
  }
}

export class RedisCache {
  public redisClient: Redis

  constructor(redisURL: string) {
    const { host, port } = parseRedisConnectionString(redisURL)
    this.redisClient = new Redis(port, host)
  }

  async setItem<T extends RedisTypes>({
    key,
    value,
    ttlInSeconds,
  }: SetRedisItem<T>): Promise<boolean> {
    let data = {}
    const valueType = typeof value

    switch (valueType) {
      case 'bigint':
        data = { type: 'bigint', value: `${String(value)}` }
        break
      case 'boolean':
        data = { type: 'boolean', value: `${value}` }
        break
      case 'number':
        data = { type: 'number', value: String(value) }
        break
      case 'object':
        data = { type: 'object', value: JSON.stringify(value) }
        break
      default:
        data = { type: 'string', value: value }
    }

    const res = await this.redisClient.set(key, JSON.stringify(data))

    const isOK = res === 'OK'
    if (!isOK) {
      throw new Error('key failed to be set')
    }

    if (ttlInSeconds) {
      // redis will remove this key with internal commands once the ttl is reached
      await this.redisClient.expire(key, ttlInSeconds)
    }

    return true
  }

  async getItem<T extends RedisTypes>(key: string): Promise<T | null> {
    const strData = await this.redisClient.get(key)

    if (!strData) {
      return null
    }

    let convertedValue: RedisTypes
    const parsedData = JSON.parse(strData) as RedisData
    const { type, value } = parsedData

    switch (type) {
      case 'bigint':
        convertedValue = BigInt(value)
        break
      case 'boolean':
        convertedValue = value === 'true'
        break
      case 'number':
        convertedValue = Number(value)
        break
      case 'object':
        convertedValue = JSON.parse(value)
        break
      default:
        convertedValue = value
    }

    return convertedValue as T
  }

  async deleteItem(key: string): Promise<void> {
    await this.redisClient.del(key)
  }
}
