const homeTitle = 'Superchain Dev Console'
const homeDescription =
  'Tools to help you build, launch, and grow your app on the Superchain'
const homeImage =
  'https://console.optimism.io/banners/page-banner.png?w=1200&h=630'

export const homeMetadata = {
  title: homeTitle,
  description: homeDescription,
  openGraph: {
    url: 'https://console.optimism.io',
    title: homeTitle,
    description: homeDescription,
    images: [
      {
        url: homeImage,
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

const insightsTitle = 'Superchain Dev Insights'

export const insightsMetadata = {
  title: insightsTitle,
  description: homeDescription,
  openGraph: {
    url: 'https://console.optimism.io/insights',
    title: insightsTitle,
    description: homeDescription,
    images: [
      {
        url: homeImage,
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

const faucetTitle = 'Superchain Faucet'
const faucetDescription =
  'Get free testnet tokens for building applications on the Superchain'

export const faucetMetadata = {
  title: faucetTitle,
  description: faucetDescription,
  openGraph: {
    url: 'https://console.optimism.io/faucet',
    title: faucetTitle,
    description: faucetDescription,
    images: [
      {
        url: homeImage,
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}
