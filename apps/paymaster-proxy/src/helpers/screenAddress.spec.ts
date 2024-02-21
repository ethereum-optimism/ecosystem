import { describe, expect, it } from 'vitest'

import { envVars } from '@/envVars'
import { screenAddress } from '@/helpers/screenAddress'
import { getRandomAddress } from '@/testUtils/getRandomAddress'
import { mockPostSuccessJson } from '@/testUtils/mswServer'

describe('screenAddress', () => {
  it('correctly parses API response', async () => {
    const address = getRandomAddress()
    mockPostSuccessJson(envVars.SCREENING_SERVICE_URL, {
      jsonrpc: '2.0',
      id: 1,
      result: [
        {
          Addr: address,
          IsSanctioned: false,
          Error: '',
        },
      ],
    })

    const result = await screenAddress(address)

    expect(result).toBe(false)
  })

  it('throws error if response is empty', async () => {
    const address = getRandomAddress()
    mockPostSuccessJson(envVars.SCREENING_SERVICE_URL, {
      jsonrpc: '2.0',
      id: 1,
      result: [],
    })

    await expect(screenAddress(address)).rejects.toThrow(
      'Failed to call screening service',
    )
  })

  it('throws error if response contains error', async () => {
    const address = getRandomAddress()
    mockPostSuccessJson(envVars.SCREENING_SERVICE_URL, {
      jsonrpc: '2.0',
      id: 1,
      error: {
        code: -32600,
        message: 'Invalid request',
      },
    })
    await expect(screenAddress(address)).rejects.toThrow(
      'Failed to call screening service',
    )
  })
})
