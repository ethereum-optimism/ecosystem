import type { QueueJobParams } from '@/config/QueueJobParams'

type HandlerByName<TQueueConfig extends QueueJobParams> = Partial<{
  [JobName in keyof TQueueConfig]: (
    jobData: TQueueConfig[JobName],
  ) => Promise<void>
}>

export class JobProcessor<TQueueConfig extends QueueJobParams> {
  private handlerByName: HandlerByName<TQueueConfig> = {}

  // register a handler to a job name
  handle<TJobName extends keyof TQueueConfig>(
    jobName: TJobName,
    handler: (jobData: TQueueConfig[TJobName]) => Promise<void>,
  ) {
    this.handlerByName[jobName] = handler
  }

  async process(job: { name: string; data: any }) {
    const handler = this.handlerByName[job.name as keyof TQueueConfig]

    if (!handler) {
      return
    }

    return await handler(job.data)
  }
}
