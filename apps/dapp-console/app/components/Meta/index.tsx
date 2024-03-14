// components/Meta.js
import Head from 'next/head'

type Props = {
  title?: string
  description?: string
  image?: string
}

const metadata = {
  title: 'Superchain Dev Console',
  description:
    'Tools to help you build, launch, and grow your dapp on the Superchain',
  image: '/banners/page-banner.png',
}

export default function Meta({
  title = metadata.title,
  description = metadata.description,
  image = metadata.image,
}: Props) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  )
}
