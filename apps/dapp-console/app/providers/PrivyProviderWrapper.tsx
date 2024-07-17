'use client'

import { PrivyProvider, User } from '@privy-io/react-auth'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { trackSuccessfulSignIn } from '@/app/event-tracking/mixpanel'
import { externalRoutes } from '@/app/constants'
import { setErrorReportingUser } from '@/app/helpers/errorReporting'
import { useFeatureFlag } from '@/app/hooks/useFeatureFlag'

// This is a public app_id provided in the privy docs: https://docs.privy.io/guide/quickstart
const PRIVY_PUBLIC_APP_ID = 'clpispdty00ycl80fpueukbhl'

function PrivyProviderWrapper({ children }: { children: React.ReactNode }) {
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
      }}
      onSuccess={handleSuccess}
    >
      {children}
    </PrivyProvider>
  )
}

export { PrivyProviderWrapper }
