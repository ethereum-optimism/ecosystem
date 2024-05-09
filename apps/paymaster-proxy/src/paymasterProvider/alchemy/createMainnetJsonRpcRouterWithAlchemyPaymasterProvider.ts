import type { ClientWithAlchemyMethods } from '@alchemy/aa-alchemy'
import { createBundlerClient } from '@alchemy/aa-core'
import type { Logger } from 'pino'
import { http } from 'viem'
import { z } from 'zod'

import type { ApiKeyServiceClient } from '@/apiKeyService/createApiKeyServiceClient'
import type { MainnetChainConfig } from '@/config/ChainConfig'
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
import { addressSchema } from '@/schemas/addressSchema'
import { paymasterContextSchema } from '@/schemas/paymasterContextSchema'
import { userOperationSchema } from '@/schemas/userOperationSchema'

export const createMainnetJsonRpcRouterWithAlchemyPaymasterProvider = ({
  chainConfig,
  database,
  apiKeyServiceClient,
  metrics,
  defaultMetricLabels,
  logger,
}: {
  chainConfig: MainnetChainConfig
  database: Database
  apiKeyServiceClient: ApiKeyServiceClient
  metrics: Metrics
  defaultMetricLabels: DefaultMetricsNamespaceLabels
  logger: Logger
}) => {
  const { chain } = chainConfig
  const { rpcUrl } = chainConfig.paymasterProviderConfig

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
    z.tuple([userOperationSchema, addressSchema, paymasterContextSchema]),
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

      const verificationResult = await handleVerifyApiKey(monitoringCtx, {
        apiKeyServiceClient,
        key: paymasterContext.policyId,
      })

      if (!verificationResult.isVerified) {
        throw new InvalidPolicyIdError()
      }

      const policy = await getSponsorshipPolicyForApiKeyId(
        database,
        verificationResult.apiKey!.id,
      )

      if (!policy || policy.providerType !== 'alchemy') {
        throw new InvalidPolicyIdError()
      }

      return await handleAlchemySponsorUserOperation(monitoringCtx, {
        alchemyClient,
        alchemyPolicyId: policy.providerMetadata.policyId,
        userOperation,
        entryPoint,
      })
    },
  )

  return jsonRpcRouter
}
