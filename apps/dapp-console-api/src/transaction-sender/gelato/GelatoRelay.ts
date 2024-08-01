import type { Address, Hex } from 'viem'
import { z } from 'zod'

export class GelatoRelay {
  constructor(private readonly apiKey: string) {}

  async sendSponsoredCall({
    chainId,
    to,
    data,
  }: {
    chainId: number
    to: Address
    data: Hex
  }) {
    return gelatoRelayPostSponsoredCall({
      apiKey: this.apiKey,
      chainId,
      to,
      data,
    })
  }

  async getTaskStatus({ taskId }: { taskId: string }) {
    return gelatoRelayGetTaskStatus({ taskId })
  }
}

// Example response
// {
//   "taskId": "text"
// }

const gelatoRelayPostSponsoredCallApiResponseSchema = z.object({
  taskId: z.string(),
})

const gelatoRelayPostSponsoredCall = async ({
  apiKey,
  chainId,
  to,
  data,
}: {
  apiKey: string
  chainId: number
  to: Address
  data: Hex
}) => {
  const response = await fetch('/relays/v2/sponsored-call', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chainId: chainId,
      target: to,
      data: data,
      sponsorApiKey: apiKey,
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to send sponsored call: ${response.statusText}`)
  }

  const json = await response.json()

  const result = gelatoRelayPostSponsoredCallApiResponseSchema.safeParse(json)

  if (!result.success) {
    throw new Error(`Invalid response from gelato relay: ${data}`, result.error)
  }

  return result.data
}

// Example response:
// {
//   "task": {
//     "chainId": 0,
//     "taskId": "text",
//     "taskState": "CheckPending",
//     "creationDate": "text",
//     "lastCheckDate": "text",
//     "lastCheckMessage": "text",
//     "transactionHash": "text",
//     "executionDate": "text",
//     "blockNumber": 0
//   }
// }

const gelatoRelayGetTaskStatusApiResponseSchema = z.object({
  task: z.object({
    chainId: z.number(),
    taskId: z.string(),
    taskState: z.enum([
      'CheckPending',
      'ExecPending',
      'ExecSuccess',
      'ExecReverted',
      'WaitingForConfirmation',
      'Blacklisted',
      'Cancelled',
    ]),
    creationDate: z.coerce.date(),
    lastCheckDate: z.coerce.date().optional(),
    lastCheckMessage: z.string().nullable().optional(),
    transactionHash: z.string().nullable().optional(),
    executionDate: z.coerce.date().nullable().optional(),
    blockNumber: z.number().nullable().optional(),
  }),
})
const gelatoRelayGetTaskStatus = async ({ taskId }: { taskId: string }) => {
  const response = await fetch(`/tasks/status/${taskId}`, {
    method: 'GET',
    headers: {},
  })
  const data = await response.json()

  const result = gelatoRelayGetTaskStatusApiResponseSchema.safeParse(data)

  if (!result.success) {
    throw new Error(`Invalid response from gelato relay: ${data}`, result.error)
  }

  return result.data
}
