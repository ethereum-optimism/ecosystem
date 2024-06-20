import { createWorker, JobProcessor } from '@eth-optimism/message-queue'
import type { Logger } from 'pino'

import {
  apiQueueConfig,
  type ApiQueueJobParams,
} from '@/api-queue/apiQueueConfig'

export const createApiQueueWorker = ({ logger }: { logger: Logger }) => {
  const jobProcessor = new JobProcessor<ApiQueueJobParams>()

  jobProcessor.handle('sayHello', async ({ helloRecipient }) => {
    console.log('Hello to', helloRecipient)
  })

  const worker = createWorker({
    ...apiQueueConfig,
    logger,
    jobProcessor,
  })

  return worker
}
