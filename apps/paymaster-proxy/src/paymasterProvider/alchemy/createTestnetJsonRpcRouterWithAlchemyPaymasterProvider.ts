import type { ClientWithAlchemyMethods } from '@alchemy/aa-alchemy'
import { createBundlerClient } from '@alchemy/aa-core'
import type { Logger } from 'pino'
import { http } from 'viem'
import { z } from 'zod'

import type { ApiKeyServiceClient } from '@/apiKeyService/createApiKeyServiceClient'
import type { TestnetChainConfig } from '@/config/ChainConfig'
import type { Database } from '@/db/Database'
import { InvalidPolicyIdError } from '@/errors/InvalidPolicyIdError'
import { SanctionedAddressError } from '@/errors/SanctionedAddressError'
import { handleScreenAddress } from '@/jsonRpc/handleScreenAddress'
import { handleVerifyApiKey } from '@/jsonRpc/handleVerifyApiKey'
import { JsonRpcRouter } from '@/jsonRpc/JsonRpcRouter'
import { getSponsorshipPolicyForApiKeyId } from '@/models/sponsorshipPolicies'
import type {
  DefaultMetricsNamespaceLabels,
  Metrics,
} from '@/monitoring/metrics'
import { handleAlchemySponsorUserOperation } from '@/paymasterProvider/alchemy/handleAlchemySponsorUserOperation'
import { entryPointSchema } from '@/schemas/entryPointSchema'
import { paymasterContextSchema } from '@/schemas/paymasterContextSchema'
import { userOperationSchema } from '@/schemas/userOperationSchema'

export const createTestnetJsonRpcRouterWithAlchemyPaymasterProvider = ({
  chainConfig,
  database,
  apiKeyServiceClient,
  metrics,
  defaultMetricLabels,
  logger,
}: {
  chainConfig: TestnetChainConfig
  database: Database
  apiKeyServiceClient: ApiKeyServiceClient
  metrics: Metrics
  defaultMetricLabels: DefaultMetricsNamespaceLabels
  logger: Logger
}) => {
  // Sanity check invariant
  if (chainConfig.paymasterProviderConfig.type !== 'alchemy') {
    throw new Error('Unsupported provider type')
  }

  const { chain } = chainConfig
  const { rpcUrl, sharedPolicyId } = chainConfig.paymasterProviderConfig

  const alchemyClient = createBundlerClient({
    chain,
    transport: http(rpcUrl),
  }) as ClientWithAlchemyMethods

  const monitoringCtx = {
    logger,
    metrics,
    defaultMetricLabels,
  }

  const jsonRpcRouter = new JsonRpcRouter()

  jsonRpcRouter.method(
    'pm_sponsorUserOperation',
    z.union([
      z.tuple([userOperationSchema, entryPointSchema]),
      // paymasterContext is optional for testnet
      z.tuple([userOperationSchema, entryPointSchema, paymasterContextSchema]),
    ]),
    async ([userOperation, entryPoint, paymasterContext]) => {
      // check if address is sanctioned

      const isAddressSanctioned = await handleScreenAddress(
        monitoringCtx,
        userOperation.sender,
      )
      if (isAddressSanctioned === true) {
        metrics.sanctionedAddressBlocked.inc(defaultMetricLabels)
        logger.info({
          message: 'Screened address',
          address: userOperation.sender,
        })
        throw new SanctionedAddressError()
      }

      // by default the shared policyId is used
      let alchemyPolicyId = sharedPolicyId

      // use the passed in policyId if it's provided
      if (paymasterContext) {
        const verificationResult = await handleVerifyApiKey(monitoringCtx, {
          apiKeyServiceClient,
          key: paymasterContext.policyId,
        })

        if (!verificationResult.isVerified) {
          metrics.policyIdVerificationFailures.inc(defaultMetricLabels)
          throw new InvalidPolicyIdError()
        }

        const policy = await getSponsorshipPolicyForApiKeyId(
          database,
          verificationResult.apiKey!.id,
        )
        if (!policy || policy.providerType !== 'alchemy') {
          metrics.providerMetadataNotFoundForPolicyId.inc(defaultMetricLabels)
          throw new InvalidPolicyIdError()
        }

        alchemyPolicyId = policy.providerMetadata.policyId
      }

      return await handleAlchemySponsorUserOperation(monitoringCtx, {
        alchemyClient,
        alchemyPolicyId,
        userOperation,
        entryPoint,
      })
    },
  )

  return jsonRpcRouter
}
