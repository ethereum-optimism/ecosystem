import type { Address } from 'viem'
import { z } from 'zod'

import { envVars } from '@/envVars'
import { addressSchema } from '@/schemas/addressSchema'
import { createJsonRpcResponseSchema } from '@/schemas/createJsonRpcResponseSchema'

const screeningServiceResultSchema = z.array(
  z.object({
    Addr: addressSchema,
    IsSanctioned: z.boolean(),
    Error: z.string(),
  }),
)

const screeningServiceResponse = createJsonRpcResponseSchema(
  screeningServiceResultSchema,
)

export const screenAddress = async (address: Address) => {
  const res = await fetch(envVars.SCREENING_SERVICE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'svc_screening',
      params: [[address]],
      id: 1,
    }),
  })

  const json = await res.json()
  const response = screeningServiceResponse.parse(json)

  if (
    'error' in response ||
    response.result.length === 0 ||
    !!response.result[0].Error
  ) {
    throw new Error('Failed to call screening service')
  }

  return response.result[0].IsSanctioned
}
