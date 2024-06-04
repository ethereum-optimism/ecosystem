import {
  type Queue,
  type QueueConfig,
  type Worker,
} from '@eth-optimism/message-queue'

import { envVars } from '@/constants'

export type ApiQueueJobParams = {
  sayHello: {
    helloRecipient: string
  }
}

export type ApiQueue = Queue<ApiQueueJobParams>

export type ApiQueueWorker = Worker

export const apiQueueConfig = {
  namespace: 'dapp-console-api',
  queueName: 'api-queue',
  redisUrl: envVars.API_QUEUE_REDIS_URL,
} as const satisfies QueueConfig
