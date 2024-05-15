import type { ApiKeyServiceClient } from '@/apiKeyService/createApiKeyServiceClient'
import type { MonitoringCtx } from '@/monitoring/MonitoringCtx'

export const handleVerifyApiKey = async (
  { logger }: MonitoringCtx,
  {
    apiKeyServiceClient,
    key,
  }: { apiKeyServiceClient: ApiKeyServiceClient; key: string },
) => {
  return await apiKeyServiceClient.keys.verifyApiKey
    .query({
      key: key,
    })
    .catch((e) => {
      logger.error(e, 'Calling verifyApiKey failed')
      throw e
    })
}
