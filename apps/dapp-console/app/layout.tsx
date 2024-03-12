import Head from 'next/head'
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
  const metadata = {
    title: 'Superchain Dev Console',
    description:
      'Tools to help you build, launch, and grow your dapp on the Superchain',
    image: '/banners/page-banner.png',
  }

  return (
    <html lang="en">
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:image" content={metadata.image} />
        <meta name="twitter:title" content={metadata.title} />
        <meta name="twitter:description" content={metadata.description} />
        <meta name="twitter:image" content={metadata.image} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
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
