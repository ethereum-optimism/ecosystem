'use client'

import { Tile } from '@/app/components/Tile/Tile'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text'

import Image from 'next/image'

const PromotionsSection = () => {
  return (
    <div>
      <Text as="h3" className="text-2xl font-semibold mb-2">
        Promotions
      </Text>
      <Text as="p" className="text-base text-muted-foreground mb-4">
        Special deals for Superchain Dapp Developers.
      </Text>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Tile
          title="Gelato"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          onClick={() => {}}
          variant="secondary"
          image={
            <Image
              src="/logos/gelato-logo.png"
              alt="Gelato logo"
              width={64}
              height={64}
            />
          }
        />
        <Tile
          title="Moralis"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          onClick={() => {}}
          variant="secondary"
          image={
            <Image
              src="/logos/moralis-logo.png"
              alt="Gelato logo"
              width={64}
              height={64}
            />
          }
        />
        <Tile
          title="QuickNode"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          onClick={() => {}}
          variant="secondary"
          image={
            <Image
              src="/logos/quicknode-logo.png"
              alt="Gelato logo"
              width={64}
              height={64}
            />
          }
        />
        <Tile
          title="ThirdWeb"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          onClick={() => {}}
          variant="secondary"
          image={
            <Image
              src="/logos/thirdweb-logo.png"
              alt="Gelato logo"
              width={64}
              height={64}
            />
          }
        />
      </div>
    </div>
  )
}

export { PromotionsSection }
