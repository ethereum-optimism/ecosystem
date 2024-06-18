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
