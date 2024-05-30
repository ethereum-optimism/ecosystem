import {
  exampleQueueConfig,
  type ExampleQueueJobParams,
} from '@/examples/example-config'
import { createQueue } from '@/queue/createQueue'

const queue = createQueue<ExampleQueueJobParams>(exampleQueueConfig)

queue.add('sendEmail', {
  to: 'tester@gmail.com',
  subject: 'Hello',
  body: 'Hello, World!',
})

queue.addMany([
  { name: 'sendSms', data: { to: '1234567890', body: 'Hello, World!' } },
  {
    name: 'sendPushNotification',
    data: { to: 'tester', title: 'Hello', body: 'Hello, World!' },
  },
])
