import type { Queue as QueueInner } from 'bullmq'

import type {
  ExtractJobUnionFromQueueJobParams,
  QueueJobParams,
} from '@/config/QueueJobParams'

// Thin wrapper around BullMQ for better typing
export class Queue<K extends QueueJobParams> {
  // escape hatch to access the BullMq Queue
  public bullMqQueue: QueueInner

  constructor(bullMqQueue: QueueInner) {
    this.bullMqQueue = bullMqQueue
  }

  async add<T extends keyof K>(jobName: T, jobData: K[T]) {
    await this.bullMqQueue.add(jobName as string, jobData)
  }

  async addMany(jobs: Array<ExtractJobUnionFromQueueJobParams<K>>) {
    await this.bullMqQueue.addBulk(jobs)
  }
}
