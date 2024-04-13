import { createTRPCNext } from '@trpc/next'
import { httpBatchLink } from '@trpc/client'
import superjson from 'superjson'

import type { ApiV0 } from '@eth-optimism/dapp-console-api'

import { ENV_VARS } from '@/app/constants/envVars'

export const apiClient = createTRPCNext<ApiV0['handler']>({
  config: () => {
    return {
      links: [
        httpBatchLink({
          url: `${ENV_VARS.API_URL}/api/v0`,
          fetch: (url, options) => {
            return fetch(url, {
              ...options,
              credentials: 'include',
            })
          },
        }),
      ],
      transformer: superjson,
    }
  },
})
