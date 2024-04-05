import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import superjson from 'superjson'

import type { ApiV0 } from '@/api/ApiV0'

export const apiClient = createTRPCProxyClient<ApiV0['handler']>({
  links: [
    httpBatchLink({
      url: 'http://host.docker.internal:7300/api/v0',
      headers: {},
    }),
  ],
  transformer: superjson,
})
