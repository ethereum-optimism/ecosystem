import { apiReact, createClient } from '../apiClient'
import type { QueryClient } from '@tanstack/react-query'

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
