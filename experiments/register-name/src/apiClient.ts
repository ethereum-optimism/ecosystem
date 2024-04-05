import type { ApiV0, MajorApiVersion } from '@eth-optimism/naming-service'
import { createTRPCReact, httpBatchLink } from '@trpc/react-query'
import superjson from 'superjson'

/**
 * React hooks for the trpc client wrapping @gateway/backend
 */
export const apiReact: ReturnType<typeof createTRPCReact<ApiV0['handler']>> =
  createTRPCReact<ApiV0['handler']>()

/**
 * Creates a trpc client from a given base URL
 */
export const createClient: () => ReturnType<
  typeof apiReact.createClient
> = () => {
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
