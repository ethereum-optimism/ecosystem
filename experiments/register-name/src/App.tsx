import '@/globals.css'
import '@rainbow-me/rainbowkit/styles.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, WagmiProvider } from 'wagmi'
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import type { Transport } from 'viem'
import { Layout } from './components/Layout'
import { HeaderRight } from './components/header/HeaderRight'
import { ThemeProvider } from './providers/ThemeProvider'
import { ApiProvider } from './providers/ApiProvider'
import { NameCard } from './components/NameCard/NameCard'
import { CheckNameCard } from './components/CheckNameCard/CheckNameCard'
import { mainnet, optimism, optimismSepolia, sepolia } from 'viem/chains'

type ProviderProps = {
  children: React.ReactNode
}

const classNames = {
  main: 'flex flex-row px-6 py-6 justify-center items-center',
  app: 'app w-full h-screen flex flex-col gap-4 max-w-screen-sm',
}

const queryClient = new QueryClient()

const opChains = [optimism, mainnet, sepolia, optimismSepolia]

const wagmiConfig = getDefaultConfig({
  appName: 'Example OP Stack Bridge',
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
  chains: [optimism, mainnet, sepolia, optimismSepolia],
  transports: opChains.reduce(
    (acc, chain) => {
      acc[chain.id] = http()
      return acc
    },
    {} as Record<number, Transport>,
  ),
})

const Providers = ({ children }: ProviderProps) => (
  <WagmiProvider reconnectOnMount config={wagmiConfig}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider>
        <ApiProvider queryClient={queryClient}>
          <ThemeProvider>{children}</ThemeProvider>
        </ApiProvider>
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
)

function App() {
  return (
    <Providers>
      <Layout headerRight={<HeaderRight />}>
        <div className={classNames.app}>
          <NameCard />
          <CheckNameCard />
        </div>
      </Layout>
    </Providers>
  )
}

export default App
