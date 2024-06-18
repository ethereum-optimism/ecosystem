type JobName = string
type JobData = any

export type QueueJobParams = Record<JobName, JobData>

export type ExtractJobUnionFromQueueJobParams<T extends QueueJobParams> = {
  [K in keyof T]: {
    name: Extract<K, JobName>
    data: T[K]
  }
}[keyof T]
