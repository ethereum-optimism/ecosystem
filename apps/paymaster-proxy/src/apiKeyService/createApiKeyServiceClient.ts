import type { ApiV0 } from '@eth-optimism/api-key-service'
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import SuperJSON from 'superjson'

export const createApiKeyServiceClient = ({ url }: { url: string }) => {
  return createTRPCProxyClient<ApiV0['handler']>({
    transformer: SuperJSON,
    links: [
      httpBatchLink({
        url,
      }),
    ],
  })
}
