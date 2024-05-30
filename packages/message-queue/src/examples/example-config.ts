import type { QueueConfig } from '@/config/QueueConfig'

export type ExampleQueueJobParams = {
  sendEmail: {
    to: string
    subject: string
    body: string
  }
  sendSms: {
    to: string
    body: string
  }
  sendPushNotification: {
    to: string
    title: string
    body: string
  }
  downloadImage: {
    imageUrl: string
  }
}

export const exampleQueueConfig = {
  namespace: 'gateway',
  queueName: 'example-queue',
  redisUrl: 'redis://localhost:6379',
} as const satisfies QueueConfig
