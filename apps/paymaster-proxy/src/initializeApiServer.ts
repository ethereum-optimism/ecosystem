import type {
  ErrorRequestHandler,
  Express,
  NextFunction,
  Request,
  Response,
} from 'express'
import express from 'express'
import type { Redis } from 'ioredis'
import { type Logger } from 'pino'

import { getV1ApiRoute, V1_API_BASE_PATH } from '@/api/getV1ApiRoute'
import { getPromBaseMetrics } from '@/middlewares/getPromBaseMetrics'
import { getRateLimiter } from '@/middlewares/getRateLimiter'
import type { Metrics } from '@/monitoring/metrics'
import type { PaymasterConfig } from '@/paymaster/types'

export const initializeApiServer = async ({
  redisClient,
  paymasterConfigs,
  metrics,
  logger,
}: {
  redisClient: Redis
  paymasterConfigs: PaymasterConfig[]
  metrics: Metrics
  logger: Logger
}): Promise<Express> => {
  const app = express()

  // Allow all origins
  app.use(cors())

  app.get('/healthz', (req, res) => {
    res.json({ ok: true })
  })

  app.get('/ready', (req, res) => {
    // TODO: add check for whether underlying services are ready
    res.json({ ok: true })
  })

  app.use(getRateLimiter(redisClient))

  app.use(getPromBaseMetrics())

  app.use(
    V1_API_BASE_PATH,
    getV1ApiRoute({
      paymasterConfigs,
      metrics,
      logger: logger.child({
        apiVersion: 'v1',
      }),
    }),
  )

  app.use((req, res) => {
    res.status(404).send()
  })

  // Default error handler
  app.use(((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(err, 'Unhandled error')
    metrics.unhandledApiServerErrorCount.inc({ apiVersion: 'v1' })
    res.status(500).send()
  }) satisfies ErrorRequestHandler)

  return app
}
