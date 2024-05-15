import { describe, expect, it, vi } from 'vitest'

import {
  createAlchemyGasManagerPolicy,
  getAlchemyGasManagerPolicy,
} from '@/paymasterProvider/alchemy/admin/alchemyGasManagerAdminActions'
import { AlchemyGasManagerAdminClient } from '@/paymasterProvider/alchemy/admin/AlchemyGasManagerAdminClient'
import { mockAlchemyGasManagerPolicy } from '@/testUtils/mockAlchemyGasManagerPolicy'

const MOCK_ACCESS_KEY = 'fake-key'
const MOCK_APP_ID = 'fake-app-id'
const MOCK_POLICY = mockAlchemyGasManagerPolicy

vi.mock(
  '@/paymasterProvider/alchemy/admin/alchemyGasManagerAdminActions',
  () => {
    return {
      createAlchemyGasManagerPolicy: vi.fn(),
      getAlchemyGasManagerPolicy: vi.fn(),
    }
  },
)

describe(AlchemyGasManagerAdminClient.name, async () => {
  const alchemyGasManagerAdminClient = new AlchemyGasManagerAdminClient({
    appId: MOCK_APP_ID,
    accessKey: MOCK_ACCESS_KEY,
  })

  it('sends request to create policy', async () => {
    await alchemyGasManagerAdminClient.createPolicy({
      policyName: MOCK_POLICY.policyName,
      policyType: MOCK_POLICY.policyType,
      rules: MOCK_POLICY.rules,
    })

    expect(createAlchemyGasManagerPolicy).toHaveBeenCalledWith({
      accessKey: MOCK_ACCESS_KEY,
      appId: MOCK_APP_ID,
      policyName: MOCK_POLICY.policyName,
      policyType: MOCK_POLICY.policyType,
      rules: MOCK_POLICY.rules,
    })
  })

  it('sends request to get policy', async () => {
    await alchemyGasManagerAdminClient.getPolicy(MOCK_POLICY.policyId)

    expect(getAlchemyGasManagerPolicy).toHaveBeenCalledWith({
      accessKey: MOCK_ACCESS_KEY,
      policyId: MOCK_POLICY.policyId,
    })
  })
})
