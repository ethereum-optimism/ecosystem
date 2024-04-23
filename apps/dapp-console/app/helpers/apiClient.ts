'use client'

import { createTRPCNext } from '@trpc/next'
import { httpBatchLink } from '@trpc/client'
import superjson from 'superjson'

import type { ApiV0 } from '@eth-optimism/dapp-console-api'

import { ENV_VARS } from '@/app/constants/envVars'

function parseAccessToken(accessToken: string) {
  return JSON.parse(accessToken)
}

export const apiClient = createTRPCNext<ApiV0['handler']>({
  config: () => {
    return {
      links: [
        httpBatchLink({
          url: `${ENV_VARS.API_URL}/api/v0`,
          fetch: (url, options) => {
            let headers: Record<string, string> = {}

            const accessToken = localStorage.getItem('privy:token')
            if (accessToken) {
              headers['Authorization'] = `Bearer ${parseAccessToken(accessToken)}`
            }

            return fetch(url, {
              ...options,
              headers,
              credentials: 'include',
            })
          },
        }),
      ],
      transformer: superjson,
    }
  },
})
