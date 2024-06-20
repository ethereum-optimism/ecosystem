import type { Worker as MessageQueueWorker } from '@eth-optimism/message-queue'
import type { Express } from 'express'
import express from 'express'
import type { Logger } from 'pino'
import pino from 'pino'

import { createApiQueueWorker } from '@/api-queue/createApiQueueWorker'

export class Processor {
  apiServer: Express
  logger: Logger
  worker: MessageQueueWorker

  constructor(apiServer: Express, logger: Logger, worker: MessageQueueWorker) {
    this.apiServer = apiServer
    this.logger = logger
    this.worker = worker
  }

  static async init() {
    const apiServer = express()
    apiServer.get('/healthz', (req, res) => res.json({ ok: true }))
    apiServer.get('/ready', (req, res) => res.json({ ok: true }))

    const logger = pino()

    const worker = createApiQueueWorker({ logger })

    return new Processor(apiServer, logger, worker)
  }

  async run() {
    this.apiServer.listen(7340, '0.0.0.0', () => {
      this.logger.info(`API server listening at http://0.0.0.0:7340`)
    })

    console.log('starting worker...')
    await this.worker.start()
  }
}
