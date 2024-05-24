'use client'

import { Inter } from 'next/font/google'
import '@/app/globals.css'
import { PrivyProviderWrapper } from '@/app/providers/PrivyProviderWrapper'
import { Header } from '@/app/components/Header'
import { ThemeProvider } from '@/app/providers/ThemeProvider'
import { FeatureFlagProvider } from '@/app/providers/FeatureFlagProvider'
import { Toaster } from '@eth-optimism/ui-components'
import { apiClient } from '@/app/helpers/apiClient'

const inter = Inter({ subsets: ['latin'] })

export const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FeatureFlagProvider>
          <PrivyProviderWrapper>
            <ThemeProvider attribute="class" defaultTheme="system">
              <Header />
              {children}
            </ThemeProvider>
          </PrivyProviderWrapper>
        </FeatureFlagProvider>
        <Toaster />
      </body>
    </html>
  )
}

export default apiClient.withTRPC(RootLayout)
