import '@/globals.css'
import '@rainbow-me/rainbowkit/styles.css'

import logo from '@/assets/logo.svg'

import { RouterProvider, Outlet, createBrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, WagmiProvider } from 'wagmi'
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit'

import type { Transport } from 'viem'
import { configureOpChains } from '@eth-optimism/op-app'

import { Bridge } from '@/routes'
import { Layout } from '@/components/Layout'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { HeaderLeft } from '@/components/header/HeaderLeft'
import { HeaderRight } from '@/components/header/HeaderRight'
import { NETWORK_TYPE } from '@/constants/networkType'
import { TicTacToe } from '@/routes/TicTacToe'
import { Home } from '@/routes/Home'
import { Playground } from '@/routes/Playground'
import { foundry } from 'viem/chains'

const classNames = {
  app: 'app w-full min-h-screen flex flex-col',
}

type ProviderProps = {
  children: React.ReactNode
}

const queryClient = new QueryClient()

const opChains = configureOpChains({ type: NETWORK_TYPE })

if (import.meta.env.VITE_DEPLOYMENT_ENV === 'local') {
  opChains.push(foundry)
}

const wagmiConfig = getDefaultConfig({
  appName: 'Example OP Stack Bridge',
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
  chains: opChains,
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
        <ThemeProvider>{children}</ThemeProvider>
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
)

const AppRoot = () => {
  return (
    <Providers>
      <div className={classNames.app}>
        <Layout
          headerLeft={<HeaderLeft logo={logo} />}
          headerRight={<HeaderRight />}
        >
          <Outlet />
        </Layout>
      </div>
    </Providers>
  )
}

const playgroundRoutes = [{ index: true, element: <Playground /> }]

const bridgeRoutes = [
  { index: true, element: <Bridge action="deposit" /> },
  { path: 'deposit', element: <Bridge action="deposit" /> },
  { path: 'withdraw', element: <Bridge action="withdrawal" /> },
]

const ticTacToeRoutes = [{ index: true, element: <TicTacToe /> }]

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppRoot />,
    children: [
      { index: true, element: <Home /> },
      { path: '/bridge', children: bridgeRoutes },
      { path: '/playground', children: playgroundRoutes },
      { path: '/tictactoe', children: ticTacToeRoutes },
    ],
  },
])

export const App = () => {
  return <RouterProvider router={router} />
}
