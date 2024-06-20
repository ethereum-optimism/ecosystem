import { createQueue } from '@eth-optimism/message-queue'

import {
  type ApiQueue,
  apiQueueConfig,
  type ApiQueueJobParams,
} from '@/api-queue/apiQueueConfig'

export const createApiQueue = (): ApiQueue => {
  return createQueue<ApiQueueJobParams>(apiQueueConfig)
}
