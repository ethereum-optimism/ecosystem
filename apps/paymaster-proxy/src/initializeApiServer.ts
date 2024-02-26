import type { Express } from 'express'
import express from 'express'
import type { Redis } from 'ioredis'

import { getV1ApiRoute, V1_API_BASE_PATH } from '@/api/getV1ApiRoute'
import { getPromBaseMetrics } from '@/middlewares/getPromBaseMetrics'
import { getRateLimiter } from '@/middlewares/getRateLimiter'
import type { Metrics } from '@/monitoring/metrics'
import type { PaymasterConfig } from '@/paymaster/types'

export const initializeApiServer = async ({
  redisClient,
  paymasterConfigs,
  metrics,
}: {
  redisClient: Redis
  paymasterConfigs: PaymasterConfig[]
  metrics: Metrics
}): Promise<Express> => {
  const app = express()

  const promMetrics = getPromBaseMetrics()

  app.use(getRateLimiter(redisClient))

  app.use(promMetrics)

  app.get('/healthz', (req, res) => {
    res.json({ ok: true })
  })

  app.get('/ready', (req, res) => {
    // TODO: add check for whether underlying services are ready
    res.json({ ok: true })
  })

  app.use(V1_API_BASE_PATH, getV1ApiRoute({ paymasterConfigs, metrics }))

  app.use((req, res) => {
    res.status(404).send()
  })

  return app
}
