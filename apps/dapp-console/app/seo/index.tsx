const homeTitle = 'Superchain Dev Console'
const homeDescription =
  'Tools to help you build, launch, and grow your dapp on Superchain'
const homeImage = '/banners/page-banner.png'

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
