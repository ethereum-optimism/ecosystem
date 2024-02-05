import type { Express } from 'express'
import express from 'express'

import { rateLimiter } from '@/middlewares/rateLimiter'

export const initializeApiServer = async (): Promise<Express> => {
  const app = express()

  app.use(rateLimiter)

  app.get('/healthz', (req, res) => {
    res.json({ ok: true })
  })

  app.get('/ready', (req, res) => {
    // TODO: add check for whether underlying services are ready
    res.json({ ok: true })
  })

  return app
}
