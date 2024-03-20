'use client'

import { Tile } from '@/app/components/Tile/Tile'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@eth-optimism/ui-components/src/components/ui/dialog/dialog'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'

import Image from 'next/image'
import { useDialogContent } from '@/app/console/useDialogContent'
import { useState } from 'react'
import { trackCardClick } from '@/app/event-tracking/mixpanel'

const PromotionsSection = () => {
  const {
    quicknodeContent,
    gelatoContent,
    thirdWebContent,
    alchemyGrowthContent,
    alchemySubgraphContent,
  } = useDialogContent()

  const [dialogContent, setDialogContent] = useState<React.ReactNode>()

  return (
    <div>
      <Text as="h3" className="text-2xl font-semibold mb-4">
        Deals
      </Text>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Dialog>
          <DialogTrigger asChild>
            <Tile
              title="Get 2 months of Alchemy Growth tier for free"
              onClick={() => {
                trackCardClick('AlchemyGrowth') // will adding this add the tracking event?
                setDialogContent(alchemyGrowthContent)
              }}
              variant="secondary"
              image={
                <Image
                  src="/logos/alchemy-logo.png"
                  alt="alchemy logo"
                  width={64}
                  height={64}
                />
              }
            />
          </DialogTrigger>
          <DialogTrigger asChild>
            <Tile
              title="Get 3 months of Alchemy Subgraphs for free "
              onClick={() => {
                trackCardClick('AlchemySubgraphs') // will adding this add the tracking event?
                setDialogContent(alchemySubgraphContent)
              }}
              variant="secondary"
              image={
                <Image
                  src="/logos/alchemy-logo.png"
                  alt="alchemy logo"
                  width={64}
                  height={64}
                />
              }
            />
          </DialogTrigger>
          <DialogTrigger asChild>
            <Tile
              title="Get 30 days of VIP deployment support from Gelato"
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
              title="Get 3 months of credits and support from Quicknode"
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
              title="Get 90 days of Thirdweb’s Growth plan and more for free"
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
