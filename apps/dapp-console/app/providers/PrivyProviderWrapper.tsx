'use client'

import { PrivyProvider } from '@privy-io/react-auth'

// This is a public app_id provided in the privy docs: https://docs.privy.io/guide/quickstart
const PRIVY_PUBLIC_APP_ID = 'clpispdty00ycl80fpueukbhl'

function PrivyProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || PRIVY_PUBLIC_APP_ID}
      config={{
        loginMethods: ['email', 'wallet'],
        appearance: {
          theme: 'light',
          accentColor: '#FF0420',
          logo: '/logos/superchain-developer-logo.svg',
        },
      }}
    >
      {children}
    </PrivyProvider>
  )
}

export { PrivyProviderWrapper }
