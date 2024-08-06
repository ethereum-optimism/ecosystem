'use client'

import { InfoBanner } from '@/app/components/Banner/InfoBanner'
import { RiStarFill } from '@remixicon/react'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'

export const Announcements = () => {
  const href =
    'https://gov.optimism.io/t/retro-funding-5-announcing-guest-voter-participation/8393'

  return (
    <div className="flex flex-col w-full mt-4 md:mt-10 lg:mt-16">
      <InfoBanner
        href={href}
        icon={<RiStarFill size={20} />}
        text={
          <Text as="p" className="font-semibold">
            Funding 5 guest voter applications are now open! Create your
            Optimist Profile and connect your GitHub account to get started. For
            more info, check out this forum post.
          </Text>
        }
      />
    </div>
  )
}
