import { apiClient } from '@/app/helpers/apiClient'

const useMessages = () => {
  const { data: messages } = apiClient.messages.messages.useQuery(undefined, {
    refetchInterval: 1000,
  })

  return { messages }
}

export { useMessages }
