import type { ApiKey } from '@eth-optimism/api-key-service'
import type { Router } from 'express'
import express from 'express'
import type { Logger } from 'pino'
import {
  baseSepolia,
  optimism,
  optimismSepolia,
  sepolia,
  zoraSepolia,
} from 'viem/chains'
import { z } from 'zod'

import type { ApiKeyServiceClient } from '@/apiKeyService/createApiKeyServiceClient'
import type { ChainConfig } from '@/config/ChainConfig'
import type { SupportedChainId } from '@/config/chainConfigByChainId'
import { chainConfigByChainId } from '@/config/chainConfigByChainId'
import { fraxtalSepolia } from '@/constants/fraxtalSepolia'
import type { Database } from '@/db/Database'
import { envVars } from '@/envVars'
import type { SponsorshipPolicy } from '@/models/sponsorshipPolicies'
import {
  createSponsorshipPolicy,
  deleteSponsorshipPolicy,
  getSponsorshipPolicy,
  listSponsorshipPoliciesForApiKeyIds,
} from '@/models/sponsorshipPolicies'
import type { AlchemyGasManagerPolicy } from '@/paymasterProvider/alchemy/admin/alchemyGasManagerAdminActions'
import { AlchemyGasManagerAdminClient } from '@/paymasterProvider/alchemy/admin/AlchemyGasManagerAdminClient'
import { getAlchemyGasManagerDefaultRules } from '@/paymasterProvider/alchemy/getAlchemyGasManagerDefaultRules'

export const ADMIN_API_BASE_PATH = '/admin'

const supportedChainIdSchema = z
  .number()
  .int()
  .refine(
    (chainId): chainId is SupportedChainId =>
      !!(chainConfigByChainId as Record<number, ChainConfig>)[chainId],
    {
      message: 'Unsupported chainId',
    },
  )

const getAlchemyGasManagerClient = (chainId: SupportedChainId) => {
  const chainConfig = chainConfigByChainId[chainId]
  return new AlchemyGasManagerAdminClient({
    accessKey: chainConfig.paymasterProviderConfig.gasManagerAccessKey,
    appId: chainConfig.paymasterProviderConfig.appId,
  })
}

const getExpandedSponsorshipPolicy = (
  sponsorshipPolicy: SponsorshipPolicy,
  apiKey: ApiKey | null,
) => {
  return {
    ...sponsorshipPolicy,
    apiKey,
  }
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
    [optimism.id]: getAlchemyGasManagerClient(optimism.id),
  } as const

  const router = express.Router()

  router.use(express.json())

  router.post('/createPaymasterSponsorshipPolicy', async (req, res) => {
    const paramsParseResult = z
      .object({
        chainId: supportedChainIdSchema,
        entityId: z.string(),
        name: z.string().optional().nullable(),
        key: z.string().optional(),
      })
      .safeParse(req.body)

    if (!paramsParseResult.success) {
      return res.status(400).json({
        error: 'Invalid params',
      })
    }

    const alchemyGasManagerAdminClient =
      alchemyGasManagerAdminClientByChainId[paramsParseResult.data.chainId]

    const { chainId, entityId, key, name } = paramsParseResult.data

    // create new API key
    let newApiKey: ApiKey
    try {
      const createApiKeyResponse =
        await apiKeyServiceClient.keys.createApiKey.mutate({
          entityId,
          state: 'enabled',
          key,
          name,
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

    let sponsorshipPolicy: SponsorshipPolicy
    // save policy ID and API key in DB
    try {
      sponsorshipPolicy = await createSponsorshipPolicy(database, {
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
      sponsorshipPolicy: getExpandedSponsorshipPolicy(
        sponsorshipPolicy,
        newApiKey,
      ),
    })
  })

  router.post(
    '/listPaymasterSponsorshipPoliciesForEntity',
    async (req, res) => {
      const paramsParseResult = z
        .object({
          entityId: z.string(),
        })
        .safeParse(req.body)

      if (!paramsParseResult.success) {
        return res.status(400).json({
          error: 'Invalid params',
        })
      }

      const listApiKeysForEntityResult =
        await apiKeyServiceClient.keys.listApiKeysForEntity.query({
          entityId: paramsParseResult.data.entityId,
        })

      const apiKeys = listApiKeysForEntityResult.apiKeys
      const apiKeyIds = apiKeys.map((x) => x.id)

      if (apiKeyIds.length === 0) {
        return res.json({
          sponsorshipPolicies: [],
        })
      }

      const apiKeyById = apiKeys.reduce<Record<string, ApiKey>>((acc, x) => {
        acc[x.id] = x
        return acc
      }, {})

      const sponsorshipPolicies = await listSponsorshipPoliciesForApiKeyIds(
        database,
        apiKeyIds,
      )

      return res.json({
        sponsorshipPolicies: sponsorshipPolicies.map((sponsorshipPolicy) =>
          getExpandedSponsorshipPolicy(
            sponsorshipPolicy,
            apiKeyById[sponsorshipPolicy.apiKeyId] || null,
          ),
        ),
      })
    },
  )

  router.post('/deletePaymasterSponsorshipPolicy', async (req, res) => {
    const paramsParseResult = z
      .object({
        id: z.string(),
      })
      .safeParse(req.body)

    if (!paramsParseResult.success) {
      return res.status(400).json({
        error: 'Invalid params',
      })
    }

    const { id: sponsorshipPolicyId } = paramsParseResult.data

    const sponsorshipPolicy = await getSponsorshipPolicy(
      database,
      sponsorshipPolicyId,
    )

    if (!sponsorshipPolicy) {
      return res.status(400).json({
        error: 'No policy found for API key',
      })
    }

    const alchemyGasManagerAdminClient =
      alchemyGasManagerAdminClientByChainId[
        Number(sponsorshipPolicy.chainId) as SupportedChainId
      ]

    if (!alchemyGasManagerAdminClient) {
      return res.status(400).json({
        error: 'No Alchemy Gas Manager client found for chain',
      })
    }

    await alchemyGasManagerAdminClient.deletePolicy(
      sponsorshipPolicy.providerMetadata.policyId,
    )

    await apiKeyServiceClient.keys.deleteApiKey.mutate({
      id: sponsorshipPolicy.apiKeyId,
    })

    await deleteSponsorshipPolicy(database, sponsorshipPolicyId)

    return res.status(200).send()
  })

  return router
}
