import type { ApiKey } from '@eth-optimism/api-key-service'
import type { Router } from 'express'
import express from 'express'
import type { Logger } from 'pino'
import { optimismSepolia } from 'viem/chains'
import { z } from 'zod'

import type { ApiKeyServiceClient } from '@/apiKeyService/createApiKeyServiceClient'
import type { Database } from '@/db/Database'
import { envVars } from '@/envVars'
import {
  createSponsorshipPolicy,
  getSponsorshipPolicyForApiKeyId,
} from '@/models/sponsorshipPolicies'
import type { AlchemyGasManagerPolicy } from '@/paymasterProvider/alchemy/alchemyGasManagerAdminActions'
import { AlchemyGasManagerAdminClient } from '@/paymasterProvider/alchemy/AlchemyGasManagerAdminClient'
import { getAlchemyGasManagerDefaultRules } from '@/paymasterProvider/alchemy/getAlchemyGasManagerDefaultRules'

export const ADMIN_API_BASE_PATH = '/admin'

type ChainConfig = {
  alchemyGasManagerAdminClient: AlchemyGasManagerAdminClient
}

export const createAdminRouter = ({
  database,
  apiKeyServiceClient,
  logger,
}: {
  database: Database
  apiKeyServiceClient: ApiKeyServiceClient
  logger: Logger
}): Router => {
  const chainConfigByChainId: Record<number, ChainConfig> = {
    [optimismSepolia.id]: {
      alchemyGasManagerAdminClient: new AlchemyGasManagerAdminClient({
        accessKey: envVars.ALCHEMY_GAS_MANAGER_ACCESS_KEY,
        appId: envVars.ALCHEMY_APP_ID_OP_SEPOLIA,
      }),
    },
  } as const

  const router = express.Router()

  router.use(express.json())

  router.post('/createPaymasterApiKey', async (req, res) => {
    const paramsParseResult = z
      .object({
        chainId: z
          .number()
          .int()
          .refine((chainId) => !!chainConfigByChainId[chainId], {
            message: 'Unsupported chainId',
          }),
        entityId: z.string(),
      })
      .safeParse(req.body)

    if (!paramsParseResult.success) {
      return res.status(400).json({
        error: 'Invalid params',
      })
    }

    const alchemyGasManagerAdminClient =
      chainConfigByChainId[paramsParseResult.data.chainId]
        .alchemyGasManagerAdminClient

    const { chainId, entityId } = paramsParseResult.data

    // create new API key
    let newApiKey: ApiKey
    try {
      const createApiKeyResponse =
        await apiKeyServiceClient.keys.createApiKey.mutate({
          entityId,
          state: 'enabled',
        })
      newApiKey = createApiKeyResponse.apiKey
    } catch (e) {
      logger.error(e, 'Failed to create API key')
      return res.status(500).json({
        error: 'Failed to create API key',
      })
    }

    // create new policy on Alchemy
    let newPaymasterProviderPolicy: AlchemyGasManagerPolicy
    try {
      newPaymasterProviderPolicy =
        await alchemyGasManagerAdminClient.createPolicy({
          policyName: `paymaster-proxy:${envVars.DEPLOYMENT_ENV}:${chainId}:${newApiKey.id}`,
          policyType: 'sponsorship',
          rules: getAlchemyGasManagerDefaultRules(),
        })
    } catch (e) {
      logger.error(e, 'Failed to create Alchemy Gas Manager policy')
      return res.status(500).json({
        error: 'Failed to create Alchemy Gas Manager policy',
      })
    }

    // save policy ID and API key in DB
    try {
      await createSponsorshipPolicy(database, {
        apiKeyId: newApiKey.id,
        chainId: chainId.toString(),
        providerType: 'alchemy',
        providerMetadata: {
          policyId: newPaymasterProviderPolicy.policyId,
        },
      })
    } catch (e) {
      logger.error(e, 'Failed to save policy ID and API key in DB')
      return res.status(500).json({
        error: 'Failed to save policy ID and API key in DB',
      })
    }

    return res.json({
      apiKey: newApiKey.key,
    })
  })

  router.post('/deletePaymasterApiKey', async (req, res) => {
    const paramsParseResult = z
      .object({
        chainId: z
          .number()
          .int()
          .refine((chainId) => !!chainConfigByChainId[chainId], {
            message: 'Unsupported chainId',
          }),
        apiKey: z.string(),
      })
      .safeParse(req.body)

    if (!paramsParseResult.success) {
      return res.status(400).json({
        error: 'Invalid params',
      })
    }

    const alchemyGasManagerAdminClient =
      chainConfigByChainId[paramsParseResult.data.chainId]
        .alchemyGasManagerAdminClient

    const { apiKey } = paramsParseResult.data

    const verifyApiKeyResult =
      await apiKeyServiceClient.keys.verifyApiKey.query({
        key: apiKey,
      })

    if (!verifyApiKeyResult || !verifyApiKeyResult.apiKey) {
      return res.status(400).json({
        error: 'Invalid API key',
      })
    }
    const apiKeyId = verifyApiKeyResult.apiKey.id

    const sponsorshipPolicy = await getSponsorshipPolicyForApiKeyId(
      database,
      apiKeyId,
    )

    if (!sponsorshipPolicy) {
      return res.status(400).json({
        error: 'No policy found for API key',
      })
    }

    await alchemyGasManagerAdminClient.deletePolicy(
      sponsorshipPolicy.providerMetadata.policyId,
    )

    await apiKeyServiceClient.keys.deleteApiKey.mutate({
      id: sponsorshipPolicy.apiKeyId,
    })

    return res.status(200).send()
  })

  return router
}
