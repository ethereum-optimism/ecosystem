'use client'

import { Tile } from '@/app/components/Tile/Tile'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@eth-optimism/ui-components/src/components/ui/dialog'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text'

import Image from 'next/image'
import { useDialogContent } from '@/app/console/useDialogContent'
import { useState } from 'react'
import { trackCardClick } from '@/app/event-tracking/mixpanel'

const PromotionsSection = () => {
  const { quicknodeContent, moralisContent, gelatoContent, thirdWebContent } =
    useDialogContent()

  const [dialogContent, setDialogContent] = useState<React.ReactNode>()

  return (
    <div>
      <Text as="h3" className="text-2xl font-semibold mb-2">
        Promotions
      </Text>
      <Text as="p" className="text-base text-muted-foreground mb-4">
        Special deals for Superchain Dapp Developers.
      </Text>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Dialog>
          <DialogTrigger asChild>
            <Tile
              title="Gelato"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
              onClick={() => {
                trackCardClick('Gelato')
                setDialogContent(gelatoContent)
              }}
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
          </DialogTrigger>
          <DialogTrigger asChild>
            <Tile
              title="Moralis"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
              onClick={() => {
                trackCardClick('Moralis')
                setDialogContent(moralisContent)
              }}
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
          </DialogTrigger>
          <DialogTrigger asChild>
            <Tile
              title="QuickNode"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
              onClick={() => {
                trackCardClick('QuickNode')
                setDialogContent(quicknodeContent)
              }}
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
          </DialogTrigger>
          <DialogTrigger asChild>
            <Tile
              title="ThirdWeb"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
              onClick={() => {
                trackCardClick('ThirdWeb')
                setDialogContent(thirdWebContent)
              }}
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
          </DialogTrigger>
          <DialogContent>{dialogContent}</DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export { PromotionsSection }
