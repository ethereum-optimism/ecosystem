import { Inter } from 'next/font/google'
import '@/app/globals.css'
import { PrivyProviderWrapper } from '@/app/providers/PrivyProviderWrapper'
import { Header } from '@/app/components/Header'
import { ThemeProvider } from '@/app/providers/ThemeProvider'
import { FeatureFlagProvider } from '@/app/providers/FeatureFlagProvider'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FeatureFlagProvider>
          <ThemeProvider attribute="class" defaultTheme="system">
            <PrivyProviderWrapper>
              <Header />
              {children}
            </PrivyProviderWrapper>
          </ThemeProvider>
        </FeatureFlagProvider>
      </body>
    </html>
  )
}
