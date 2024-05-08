import cors from 'cors'
import type {
  ErrorRequestHandler,
  Express,
  NextFunction,
  Request,
  Response,
} from 'express'
import express from 'express'
import type { Redis } from 'ioredis'
import morgan from 'morgan'
import { type Logger } from 'pino'

import { envVars } from '@/envVars'
import type { BackendReadinessState } from '@/helpers/BackendReadinessState'
import { getRateLimiter } from '@/middlewares/getRateLimiter'
import type { Metrics } from '@/monitoring/metrics'

export const initializeAdminApiServer = async ({
  redisClient,
  metrics,
  logger,
  backendReadinessState,
}: {
  redisClient: Redis
  metrics: Metrics
  logger: Logger
  backendReadinessState: BackendReadinessState
}): Promise<Express> => {
  const app = express()

  app.use(
    morgan('short', {
      stream: {
        write: (str: string) => {
          logger.info(
            {
              log: str,
            },
            'server log',
          )
        },
      },
    }),
  )

  // Allow all origins
  app.use(cors())

  app.get('/healthz', (req, res) => {
    res.json({ ok: true, isAdmin: true })
  })

  app.get('/ready', (req, res) => {
    if (!backendReadinessState.getIsReady()) {
      return res.status(503).send()
    }

    res.json({ ok: true, isAdmin: true })
  })

  if (envVars.SHOULD_TRUST_PROXY) {
    app.set('trust proxy', true)
  }
  app.use(getRateLimiter(redisClient))

  app.use((req, res) => {
    res.status(404).send()
  })

  // Default error handler
  app.use(((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(err, 'Unhandled error')
    metrics.unhandledAdminApiServerErrorCount.inc()
    res.status(500).send()
  }) satisfies ErrorRequestHandler)

  return app
}
