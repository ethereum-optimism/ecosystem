import type { ClientWithAlchemyMethods } from '@alchemy/aa-alchemy'
import { createBundlerClient } from '@alchemy/aa-core'
import type { Logger } from 'pino'
import type { Chain } from 'viem'
import { http } from 'viem'
import { z } from 'zod'

import { JsonRpcCastableError } from '@/errors/JsonRpcCastableError'
import { SanctionedAddressError } from '@/errors/SanctionedAddressError'
import { screenAddress } from '@/helpers/screenAddress'
import { JsonRpcRouter } from '@/jsonRpc/JsonRpcRouter'
import type {
  DefaultMetricsNamespaceLabels,
  Metrics,
} from '@/monitoring/metrics'
import { alchemySponsorUserOperation } from '@/paymasterProvider/alchemy/alchemySponsorUserOperation'
import { addressSchema } from '@/schemas/addressSchema'
import { userOperationSchema } from '@/schemas/userOperationSchema'

export const createTestnetJsonRpcRouterWithAlchemyPaymasterProvider = ({
  chain,
  rpcUrl,
  sharedPolicyId,
  metrics,
  defaultMetricLabels,
  logger,
}: {
  chain: Chain
  rpcUrl: string
  sharedPolicyId: string
  metrics: Metrics
  defaultMetricLabels: DefaultMetricsNamespaceLabels
  logger: Logger
}) => {
  const alchemyClient = createBundlerClient({
    chain,
    transport: http(rpcUrl),
  }) as ClientWithAlchemyMethods

  const jsonRpcRouter = new JsonRpcRouter()

  jsonRpcRouter.method(
    'pm_sponsorUserOperation',
    z.tuple([userOperationSchema, addressSchema]),
    async ([userOperation, entryPoint]) => {
      // check if address is sanctioned
      try {
        const isAddressSanctioned = await screenAddress(userOperation.sender)

        if (isAddressSanctioned === true) {
          metrics.sanctionedAddressBlocked.inc(defaultMetricLabels)
          logger.info({
            message: 'Screened address',
            address: userOperation.sender,
          })
          throw new SanctionedAddressError()
        }
      } catch (e) {
        metrics.screeningServiceCallFailures.inc(defaultMetricLabels)
        logger.error({
          message: 'Error while screening address',
          error: e,
          address: userOperation.sender,
        })

        throw e
      }

      // proxy request to the provider
      try {
        const result = await alchemySponsorUserOperation(
          alchemyClient,
          sharedPolicyId,
          userOperation,
          entryPoint,
        )

        metrics.paymasterCallSuccesses.inc(defaultMetricLabels)
        return result
      } catch (e) {
        logger.error(e, 'Alchemy paymaster provider RPC error')
        if (e instanceof JsonRpcCastableError) {
          metrics.paymasterCallRpcFailures.inc({
            ...defaultMetricLabels,
            jsonRpcCode: e.jsonRpcErrorCode,
          })
        } else {
          metrics.paymasterCallNonRpcFailures.inc(defaultMetricLabels)
        }
        throw e
      }
    },
  )

  return jsonRpcRouter
}
