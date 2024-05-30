import pino from 'pino'

import type { ExampleQueueJobParams } from '@/examples/example-config'
import { exampleQueueConfig } from '@/examples/example-config'
import { JobProcessor } from '@/job-processor/JobProcessor'
import { createWorker } from '@/worker/createWorker'

const jobProcessor = new JobProcessor<ExampleQueueJobParams>()

jobProcessor.handle('sendEmail', async (jobData) => {
  console.log('Sending email to:', jobData.to)
})

jobProcessor.handle('downloadImage', async (jobData) => {
  console.log('downloading image to:', jobData.imageUrl)
})

const worker = createWorker({
  ...exampleQueueConfig,
  logger: pino(),
  jobProcessor,
})

worker.start()
