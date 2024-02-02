import type { Express } from 'express'
import express from 'express'
import type { Redis } from 'ioredis'

import { getRateLimiter } from '@/middlewares/getRateLimiter'

export const initializeApiServer = async (
  redisClient: Redis,
): Promise<Express> => {
  const app = express()

  app.use(getRateLimiter(redisClient))

  app.get('/healthz', (req, res) => {
    res.json({ ok: true })
  })

  app.get('/ready', (req, res) => {
    // TODO: add check for whether underlying services are ready
    res.json({ ok: true })
  })

  return app
}
