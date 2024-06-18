import type { Job } from 'bullmq'
import { Worker as WorkerInner } from 'bullmq'
import type { Logger } from 'pino'

import type { QueueConfig } from '@/config/QueueConfig'
import type { QueueJobParams } from '@/config/QueueJobParams'
import type { JobProcessor } from '@/job-processor/JobProcessor'
import { parseRedisConnectionString } from '@/utils/parseRedisConnectionString'
import { Worker } from '@/worker/Worker'

export type CreateWorkerParams = QueueConfig & {
  logger: Logger
  jobProcessor: JobProcessor<QueueJobParams>
}

export const createWorker = ({
  namespace,
  queueName,
  redisUrl,
  logger,
  jobProcessor,
}: CreateWorkerParams) => {
  const { host, port } = parseRedisConnectionString(redisUrl)

  const namespacedQueueName = `${namespace}:${queueName}`

  const logTag = `Worker[${namespacedQueueName}]`

  const bullMqWorker = new WorkerInner(
    namespacedQueueName,
    async (job) => {
      try {
        await jobProcessor.process(job)
      } catch (e) {
        logger.error(`${logTag} ${e.message}`, e)
      }
    },
    {
      connection: { host, port },
      autorun: false,
    },
  )
  bullMqWorker.on('drained', () => {
    logger.info(`${logTag} no more jobs to process`)
  })

  bullMqWorker.on('paused', () => {
    logger.info(`${logTag} paused`)
  })

  bullMqWorker.on('resumed', () => {
    logger.info(`${logTag} resumed`)
  })

  bullMqWorker.on('error', (error: Error) => {
    logger.error(`${logTag} ${error.message}`, error)
  })

  // job level events
  bullMqWorker.on('active', (job: Job) => {
    logger.info(`${logTag} processing job: ${job.id}`)
  })

  bullMqWorker.on('stalled', (jobId: string) => {
    logger.warn(`${logTag} stalled job: ${jobId}`)
  })

  bullMqWorker.on('completed', (job: Job) => {
    logger.info(`${logTag} completed job: ${job.id}`)
  })

  bullMqWorker.on(
    'failed',
    (job: Job | undefined, error: Error, _prev: string) => {
      if (!job) {
        logger.error(`${logTag} unhandled job failure`, error)
      } else {
        logger.error(`${logTag} failed job: ${job.id}`, error)
      }
    },
  )

  return new Worker(bullMqWorker)
}
