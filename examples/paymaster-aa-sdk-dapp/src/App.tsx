import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from '@/config'
import { MainPage } from '@/pages/MainPage'

const queryClient = new QueryClient()

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <MainPage />
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
