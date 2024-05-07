import { describe, it } from 'vitest'

import {
  createAlchemyGasManagerPolicy,
  getAlchemyGasManagerPolicy,
} from '@/paymasterProvider/alchemy/alchemyGasManagerAdminActions'
import { getAlchemyGasManagerDefaultRules } from '@/paymasterProvider/alchemy/getAlchemyGasManagerDefaultRules'

describe('test Alchemy Gas Manager API calls', async () => {
  it('create and get', async () => {
    const createResult = await createAlchemyGasManagerPolicy({
      accessKey: process.env.ALCHEMY_GAS_MANAGER_ACCESS_KEY!,
      appId: process.env.ALCHEMY_GAS_MANAGER_APP_ID!,
      policyName: 'e2e-test',
      policyType: 'sponsorship',
      rules: getAlchemyGasManagerDefaultRules(),
    })
    console.log(createResult)

    const getResult = await getAlchemyGasManagerPolicy({
      accessKey: process.env.ALCHEMY_GAS_MANAGER_ACCESS_KEY!,
      policyId: createResult.policyId,
    })

    console.log(getResult)
  })
})
