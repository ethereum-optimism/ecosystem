import type { ApiV0, MajorApiVersion } from '@eth-optimism/naming-service'
import type { QueryClient } from '@tanstack/react-query'
import { createTRPCReact, httpBatchLink } from '@trpc/react-query'
import React from 'react'
import superjson from 'superjson'

/**
 * React hooks for the trpc client wrapping @gateway/backend
 */
export const apiReact = createTRPCReact<ApiV0['handler']>()

/**
 * Creates a trpc client from a given base URL
 */
const createClient = () => {
  const version: typeof MajorApiVersion.LATEST = 'v0'
  const url = `${import.meta.env.VITE_API_URL}/api/${version}`
  return apiReact.createClient({
    transformer: superjson,
    links: [
      httpBatchLink({
        url,
        fetch(url, options) {
          return fetch(url, {
            ...options,
          })
        },
      }),
    ],
  })
}

/**
 * The provider for the TRPC client wrapping @gateway/backend
 */
export const ApiProvider: React.FC<{
  children: React.ReactNode
  queryClient: QueryClient
}> = ({ children, queryClient }) => {
  const trpcClient = createClient()
  return (
    <apiReact.Provider queryClient={queryClient} client={trpcClient}>
      {children}
    </apiReact.Provider>
  )
}
