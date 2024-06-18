import { Queue as QueueInner } from 'bullmq'

import type { QueueConfig } from '@/config/QueueConfig'
import type { QueueJobParams } from '@/config/QueueJobParams'
import { Queue } from '@/queue/Queue'
import { parseRedisConnectionString } from '@/utils/parseRedisConnectionString'

export type CreateQueueParams = QueueConfig

export const createQueue = <K extends QueueJobParams>({
  namespace,
  queueName,
  redisUrl,
}: CreateQueueParams) => {
  const { host, port } = parseRedisConnectionString(redisUrl)

  const namespacedQueueName = `${namespace}:${queueName}`

  const queue = new QueueInner(namespacedQueueName, {
    connection: { host, port },
  })

  return new Queue<K>(queue)
}
