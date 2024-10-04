'use client'

import { PrivyProvider, User } from '@privy-io/react-auth'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { trackSuccessfulSignIn } from '@/app/event-tracking/mixpanel'
import { externalRoutes } from '@/app/constants'
import { setErrorReportingUser } from '@/app/helpers/errorReporting'
import { useFeatureFlag } from '@/app/hooks/useFeatureFlag'
import { configureOpChains } from '@eth-optimism/op-app'
import type { Chain, Transport } from 'viem'
import { createConfig, WagmiProvider } from '@privy-io/wagmi'
import { supersimL1, supersimL2A, supersimL2B } from '@eth-optimism/viem'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http } from 'wagmi'

// This is a public app_id provided in the privy docs: https://docs.privy.io/guide/quickstart
const PRIVY_PUBLIC_APP_ID = 'clpispdty00ycl80fpueukbhl'

const opChains = configureOpChains({ type: 'op' }) as [Chain, ...[Chain]]

opChains.push(supersimL1 as Chain)
opChains.push(supersimL2A as Chain)
opChains.push(supersimL2B as Chain)

const config = createConfig({
  chains: opChains,
  transports: opChains.reduce(
    (acc, chain) => {
      acc[chain.id] = http()
      return acc
    },
    {} as Record<number, Transport>,
  ),
})

function PrivyProviderWrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()
  const { theme, resolvedTheme } = useTheme()
  const showNewLogo = useFeatureFlag('enable_new_brand')
  const lightLogo = showNewLogo
    ? '/logos/new-superchain-developer-logo-light.svg'
    : '/logos/superchain-developer-logo-light.svg'
  const darkLogo = showNewLogo
    ? '/logos/new-superchain-developer-logo-dark.svg'
    : '/logos/superchain-developer-logo'
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Render nothing while waiting for the client-side to determine the theme
    return null
  }

  const logo =
    theme === 'dark' || resolvedTheme === 'dark' ? darkLogo : lightLogo

  const handleSuccess = (user: User, isNewUser: boolean) => {
    setErrorReportingUser(user.id)
    trackSuccessfulSignIn(isNewUser)
  }

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || PRIVY_PUBLIC_APP_ID}
      config={{
        loginMethods: ['email'],
        appearance: {
          theme: theme === 'dark' ? 'dark' : 'light',
          accentColor: '#FF0420',
          logo: logo,
        },
        legal: {
          termsAndConditionsUrl: externalRoutes.TERMS.path,
          privacyPolicyUrl: externalRoutes.COMMUNITY_AGREEMENT.path,
        },
        supportedChains: opChains,
      }}
      onSuccess={handleSuccess}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>{children}</WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  )
}

export { PrivyProviderWrapper }
