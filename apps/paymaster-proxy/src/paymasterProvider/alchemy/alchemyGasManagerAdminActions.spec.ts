import { describe, expect, it, vi } from 'vitest'
import { ZodError } from 'zod'

import {
  createAlchemyGasManagerPolicy,
  deleteAlchemyGasManagerPolicy,
  getAlchemyGasManagerHeaders,
  getAlchemyGasManagerPolicy,
} from '@/paymasterProvider/alchemy/alchemyGasManagerAdminActions'
import { mockAlchemyGasManagerPolicy } from '@/testUtils/mockAlchemyGasManagerPolicy'
import {
  mockDeleteSuccess,
  mockGetError,
  mockGetErrorWithReturnJson,
  mockGetSuccessJson,
  mockPostError,
  mockPostErrorWithReturnJson,
  mockPostSuccessJson,
} from '@/testUtils/mswServer'

const MOCK_ACCESS_KEY = 'fake-key'

const MOCK_POLICY = mockAlchemyGasManagerPolicy

describe(getAlchemyGasManagerHeaders.name, async () => {
  it('returns headers with access key', async () => {
    const headers = getAlchemyGasManagerHeaders(MOCK_ACCESS_KEY)

    expect(headers).toEqual({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${MOCK_ACCESS_KEY}`,
    })
  })
})

describe(createAlchemyGasManagerPolicy.name, async () => {
  it('sends correct POST request to Alchemy', async () => {
    vi.spyOn(global, 'fetch')

    mockPostSuccessJson('https://manage.g.alchemy.com/api/gasManager/policy', {
      data: { policy: MOCK_POLICY },
    })

    const newPolicy = await createAlchemyGasManagerPolicy({
      accessKey: MOCK_ACCESS_KEY,
      policyName: MOCK_POLICY.policyName,
      policyType: MOCK_POLICY.policyType,
      appId: MOCK_POLICY.appId,
      rules: MOCK_POLICY.rules,
    })

    expect(fetch).toHaveBeenCalledOnce()
    expect(fetch).toHaveBeenCalledWith(
      'https://manage.g.alchemy.com/api/gasManager/policy',
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${MOCK_ACCESS_KEY}`,
        },
        method: 'POST',
        body: JSON.stringify({
          policyName: MOCK_POLICY.policyName,
          policyType: MOCK_POLICY.policyType,
          appId: MOCK_POLICY.appId,
          rules: MOCK_POLICY.rules,
        }),
      },
    )

    expect(MOCK_POLICY).toMatchObject(newPolicy)
  })

  it('throws error if response is not successful', async () => {
    mockPostErrorWithReturnJson(
      'https://manage.g.alchemy.com/api/gasManager/policy',
      401,
      {
        message: 'Not allowed',
      },
    )

    await expect(
      createAlchemyGasManagerPolicy({
        accessKey: MOCK_ACCESS_KEY,
        policyName: MOCK_POLICY.policyName,
        policyType: MOCK_POLICY.policyType,
        appId: MOCK_POLICY.appId,
        rules: MOCK_POLICY.rules,
      }),
    ).rejects.toThrowError(
      /Failed to create Alchemy Gas Manager policy: \[401: Unauthorized\] Not allowed/,
    )
  })

  it('throws error if response is not JSON', async () => {
    mockPostError('https://manage.g.alchemy.com/api/gasManager/policy', 400)

    await expect(
      createAlchemyGasManagerPolicy({
        accessKey: MOCK_ACCESS_KEY,
        policyName: MOCK_POLICY.policyName,
        policyType: MOCK_POLICY.policyType,
        appId: MOCK_POLICY.appId,
        rules: MOCK_POLICY.rules,
      }),
    ).rejects.toThrowError(/Failed to create Alchemy Gas Manager policy:/)
  })

  it('throws error if response is not valid policy', async () => {
    mockPostSuccessJson('https://manage.g.alchemy.com/api/gasManager/policy', {
      data: { policy: { somethingWrong: true } },
    })

    await expect(
      createAlchemyGasManagerPolicy({
        accessKey: MOCK_ACCESS_KEY,
        policyName: MOCK_POLICY.policyName,
        policyType: MOCK_POLICY.policyType,
        appId: MOCK_POLICY.appId,
        rules: MOCK_POLICY.rules,
      }),
    ).rejects.toThrow(ZodError)
  })
})

describe(getAlchemyGasManagerPolicy.name, async () => {
  it('sends correct GET request to Alchemy', async () => {
    vi.spyOn(global, 'fetch')

    mockGetSuccessJson('https://manage.g.alchemy.com/api/gasManager/policy/*', {
      data: { policy: MOCK_POLICY },
    })

    const policy = await getAlchemyGasManagerPolicy({
      accessKey: MOCK_ACCESS_KEY,
      policyId: MOCK_POLICY.policyId,
    })

    expect(fetch).toHaveBeenCalledOnce()
    expect(fetch).toHaveBeenCalledWith(
      `https://manage.g.alchemy.com/api/gasManager/policy/${MOCK_POLICY.policyId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${MOCK_ACCESS_KEY}`,
        },
      },
    )

    expect(MOCK_POLICY).toMatchObject(policy)
  })

  it('throws error if response is not successful', async () => {
    mockGetErrorWithReturnJson(
      'https://manage.g.alchemy.com/api/gasManager/policy/*',
      400,
      {
        message: 'Invalid policy ID',
      },
    )

    await expect(
      getAlchemyGasManagerPolicy({
        accessKey: MOCK_ACCESS_KEY,
        policyId: MOCK_POLICY.policyId,
      }),
    ).rejects.toThrowError(
      /Failed to get Alchemy Gas Manager policy with policyId/,
    )
  })

  it('throws error if response is not JSON', async () => {
    mockGetError('https://manage.g.alchemy.com/api/gasManager/policy/*', 400)

    await expect(
      getAlchemyGasManagerPolicy({
        accessKey: MOCK_ACCESS_KEY,
        policyId: MOCK_POLICY.policyId,
      }),
    ).rejects.toThrowError(
      /Failed to get Alchemy Gas Manager policy with policyId/,
    )
  })

  it('throws error if response is not valid policy', async () => {
    mockGetSuccessJson('https://manage.g.alchemy.com/api/gasManager/policy/*', {
      data: { policy: { unknownParams: 'haha' } },
    })

    await expect(
      getAlchemyGasManagerPolicy({
        accessKey: MOCK_ACCESS_KEY,
        policyId: MOCK_POLICY.policyId,
      }),
    ).rejects.toThrow(ZodError)
  })
})

describe(deleteAlchemyGasManagerPolicy.name, async () => {
  it('sends correct DELETE request to Alchemy', async () => {
    vi.spyOn(global, 'fetch')

    mockDeleteSuccess('https://manage.g.alchemy.com/api/gasManager/policy/*')

    await deleteAlchemyGasManagerPolicy({
      accessKey: MOCK_ACCESS_KEY,
      policyId: MOCK_POLICY.policyId,
    })

    expect(fetch).toHaveBeenCalledOnce()
    expect(fetch).toHaveBeenCalledWith(
      `https://manage.g.alchemy.com/api/gasManager/policy/${MOCK_POLICY.policyId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${MOCK_ACCESS_KEY}`,
        },
        method: 'DELETE',
      },
    )
  })
})
