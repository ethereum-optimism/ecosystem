import '@/globals.css'
import logo from '@/assets/logo.svg'

import { RouterProvider, Outlet, createBrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createConfig, http, WagmiProvider } from 'wagmi'

import type { Chain, Transport } from 'viem'
import { configureOpChains } from 'op-app'

import { Bridge } from '@/routes'
import { Layout } from '@/components/Layout'
import { connectors } from '@/constants/connectors'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { HeaderLeft } from '@/components/header/HeaderLeft'
import { HeaderRight } from '@/components/header/HeaderRight'
import { NETWORK_TYPE } from '@/constants/networkType'

const classNames = {
  app: 'app w-full min-h-screen flex flex-col',
}

type ProviderProps = {
  children: React.ReactNode
}

const queryClient = new QueryClient()

const opChains = configureOpChains({ type: NETWORK_TYPE })

const wagmiConfig = createConfig({
  chains: opChains as readonly [Chain, ...Chain[]],
  connectors,
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
      <ThemeProvider>{children}</ThemeProvider>
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

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppRoot />,
    children: [
      { path: '/', element: <Bridge action="deposit" /> },
      { path: '/deposit', element: <Bridge action="deposit" /> },
      { path: '/withdrawal', element: <Bridge action="withdrawal" /> },
    ],
  },
])

export const App = () => {
  return <RouterProvider router={router} />
}
