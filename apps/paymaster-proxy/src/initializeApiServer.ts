import type { Express } from 'express'
import express, { Router } from 'express'
import type { Redis } from 'ioredis'
import { z } from 'zod'

import { getRateLimiter } from '@/middlewares/getRateLimiter'
import { pmSponsorUserOperationRequestParamsSchema } from '@/schemas/pmSponsorUserOperationRequestParamsSchema'

const sepoliaRoute = Router()

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

  app.post('/sepolia', async (req, res) => {
    // validate

    z.array(pmSponsorUserOperationRequestParamsSchema).parse(req.body)

    // send

    // return response
  })

  return app
}
