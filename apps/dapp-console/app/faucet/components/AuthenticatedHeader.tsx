import { Authentications } from '@/app/faucet/types'
import { RiCheckboxCircleFill } from '@remixicon/react'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'
import Image from 'next/image'
import { useMemo } from 'react'

type Props = {
  authentications: Authentications
}

const getAuthenticatedLabelAndImages = (authentications: Authentications) => {
  // Define the labels and images for each authentication type
  const data: Record<keyof Authentications, { label: string; image: string }> =
    {
      coinbase: { label: 'Coinbase', image: '/logos/coinbase-logo.png' },
      worldId: { label: 'World ID', image: '/logos/worldid-logo.png' },
      gitcoin: { label: 'Gitcoin', image: '/logos/gitcoin-logo.png' },
      eas: { label: 'EAS', image: '/logos/eas-logo.png' },
    }

  // Get an array of active labels and images
  const activeServices = Object.keys(authentications)
    .filter((key) => authentications[key as keyof Authentications])
    .map((key) => data[key as keyof Authentications])

  // Construct the labels and images output
  const labels = activeServices.map((service) => service.label)
  const images = activeServices.map((service) => service.image)

  // Format the labels with commas and 'and'
  const labelsText =
    labels.length > 1
      ? `${labels.slice(0, -1).join(', ')} and ${labels[labels.length - 1]}`
      : labels[0] || ''

  return { label: labelsText, images }
}

const AuthenticatedHeader = ({ authentications }: Props) => {
  const { label, images } = useMemo(
    () => getAuthenticatedLabelAndImages(authentications),
    [authentications],
  )

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="flex mb-4">
        {images.map((image, index) => (
          <Image
            key={index}
            src={image}
            alt={`Logo ${index}`}
            height={96}
            width={96}
            style={{
              zIndex: images.length - index,
              marginLeft: index === 0 ? 0 : '-16px',
            }}
          />
        ))}
      </div>
      <div className="flex items-center gap-1 mb-1">
        <RiCheckboxCircleFill size={16} color="#5BA85A" />
        <Text as="p" className="text-lg font-semibold">
          Verified with {label}
        </Text>
      </div>
      <Text as="p" className="text-secondary-foreground">
        You can claim 1 test ETH on 1 network every 24 hours.
      </Text>
    </div>
  )
}

export { AuthenticatedHeader }
