import type { ApiKey } from '@eth-optimism/api-key-service'
import type { Router } from 'express'
import express from 'express'
import type { Logger } from 'pino'
import { baseSepolia, optimismSepolia, sepolia, zoraSepolia } from 'viem/chains'
import { z } from 'zod'

import type { ApiKeyServiceClient } from '@/apiKeyService/createApiKeyServiceClient'
import type { ChainConfig } from '@/config/ChainConfig'
import type { SupportedTestnetChainId } from '@/config/chainConfigByChainId'
import { chainConfigByChainId } from '@/config/chainConfigByChainId'
import { fraxtalSepolia } from '@/constants/fraxtalSepolia'
import type { Database } from '@/db/Database'
import { envVars } from '@/envVars'
import {
  createSponsorshipPolicy,
  getSponsorshipPolicyForApiKeyId,
} from '@/models/sponsorshipPolicies'
import type { AlchemyGasManagerPolicy } from '@/paymasterProvider/alchemy/admin/alchemyGasManagerAdminActions'
import { AlchemyGasManagerAdminClient } from '@/paymasterProvider/alchemy/admin/AlchemyGasManagerAdminClient'
import { getAlchemyGasManagerDefaultRules } from '@/paymasterProvider/alchemy/getAlchemyGasManagerDefaultRules'

export const ADMIN_API_BASE_PATH = '/admin'

const supportedChainIdSchema = z
  .number()
  .int()
  .refine(
    (chainId): chainId is SupportedTestnetChainId =>
      !!(chainConfigByChainId as Record<number, ChainConfig>)[chainId],
    {
      message: 'Unsupported chainId',
    },
  )

type SupportedChainId = keyof typeof chainConfigByChainId

const getAlchemyGasManagerClient = (chainId: SupportedChainId) => {
  const chainConfig = chainConfigByChainId[chainId]
  return new AlchemyGasManagerAdminClient({
    accessKey: chainConfig.paymasterProviderConfig.gasManagerAccessKey,
    appId: chainConfig.paymasterProviderConfig.appId,
  })
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
  const alchemyGasManagerAdminClientByChainId: Record<
    SupportedChainId,
    AlchemyGasManagerAdminClient
  > = {
    [sepolia.id]: getAlchemyGasManagerClient(sepolia.id),
    [optimismSepolia.id]: getAlchemyGasManagerClient(optimismSepolia.id),
    [zoraSepolia.id]: getAlchemyGasManagerClient(zoraSepolia.id),
    [baseSepolia.id]: getAlchemyGasManagerClient(baseSepolia.id),
    [fraxtalSepolia.id]: getAlchemyGasManagerClient(fraxtalSepolia.id),
  } as const

  const router = express.Router()

  router.use(express.json())

  router.post('/createPaymasterApiKey', async (req, res) => {
    const paramsParseResult = z
      .object({
        chainId: supportedChainIdSchema,
        entityId: z.string(),
      })
      .safeParse(req.body)

    if (!paramsParseResult.success) {
      return res.status(400).json({
        error: 'Invalid params',
      })
    }

    const alchemyGasManagerAdminClient =
      alchemyGasManagerAdminClientByChainId[paramsParseResult.data.chainId]

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
        chainId: supportedChainIdSchema,
        apiKey: z.string(),
      })
      .safeParse(req.body)

    if (!paramsParseResult.success) {
      return res.status(400).json({
        error: 'Invalid params',
      })
    }

    const chainId = paramsParseResult.data.chainId

    const alchemyGasManagerAdminClient =
      alchemyGasManagerAdminClientByChainId[chainId]

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

    if (sponsorshipPolicy.chainId !== chainId.toString()) {
      return res.status(400).json({
        error: 'Policy chainId does not match the provided chainId',
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
