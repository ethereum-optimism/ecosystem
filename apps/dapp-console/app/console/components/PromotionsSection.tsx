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
import {
  alchemyGrowthMetadata,
  alchemySubgraphMetadata,
  bwareMetadata,
  gelatoMetadata,
  privyMetadata,
  quicknodeMetadata,
  sherlockMetadata,
  spearbitMetadata,
  thirdWebMetadata,
} from '@/app/console/constants'
import { Button } from '@eth-optimism/ui-components/src/components/ui/button/button'
import { DialogMetadata } from '@/app/components/StandardDialogContent'

enum PromotionCategory {
  All = 'All',
  Tooling = 'Tooling & APIs',
  Infrastructure = 'Infrastructure',
  Security = 'Security',
}

type Promotion = {
  content: React.ReactNode
  tag: PromotionCategory
  metadata: DialogMetadata
  trackingLabel: string
}

const filterPromosByCategory = (
  category: PromotionCategory,
  promos: Promotion[],
) => {
  return promos.filter((promo) => promo.tag === category || category === 'All')
}

const PromotionsSection = () => {
  const {
    quicknodeContent,
    gelatoContent,
    thirdWebContent,
    alchemyGrowthContent,
    alchemySubgraphContent,
    spearbitContent,
    privyContent,
    bwareContent,
    sherlockContent,
  } = useDialogContent()

  const promos: Promotion[] = [
    {
      content: alchemyGrowthContent,
      metadata: alchemyGrowthMetadata,
      tag: PromotionCategory.Infrastructure,
      trackingLabel: 'AlchemyGrowth',
    },
    {
      content: alchemySubgraphContent,
      metadata: alchemySubgraphMetadata,
      tag: PromotionCategory.Infrastructure,
      trackingLabel: 'AlchemySubgraph',
    },
    {
      content: gelatoContent,
      metadata: gelatoMetadata,
      tag: PromotionCategory.Tooling,
      trackingLabel: 'Gelato',
    },
    {
      content: quicknodeContent,
      metadata: quicknodeMetadata,
      tag: PromotionCategory.Infrastructure,
      trackingLabel: 'QuickNode',
    },
    {
      content: thirdWebContent,
      metadata: thirdWebMetadata,
      tag: PromotionCategory.Tooling,
      trackingLabel: 'ThirdWeb',
    },
    {
      content: spearbitContent,
      metadata: spearbitMetadata,
      tag: PromotionCategory.Security,
      trackingLabel: 'Spearbit',
    },
    {
      content: privyContent,
      metadata: privyMetadata,
      tag: PromotionCategory.Tooling,
      trackingLabel: 'Privy',
    },
    {
      content: bwareContent,
      metadata: bwareMetadata,
      tag: PromotionCategory.Tooling,
      trackingLabel: 'Bware',
    },
    {
      content: sherlockContent,
      metadata: sherlockMetadata,
      tag: PromotionCategory.Security,
      trackingLabel: 'Sherlock',
    },
  ]

  const [currentFilter, setCurrentFilter] = useState<PromotionCategory>(
    PromotionCategory.All,
  )
  const [dialogContent, setDialogContent] = useState<React.ReactNode>()
  const currentPromos = filterPromosByCategory(currentFilter, promos)

  return (
    <div>
      <Text as="h3" className="text-2xl font-semibold mb-4">
        Deals
      </Text>
      <div className="mb-4 flex gap-4">
        {Object.values(PromotionCategory).map((category, index) => (
          <Button
            size="sm"
            variant={currentFilter === category ? 'toggled' : 'secondary'}
            className="rounded-full"
            key={category}
            onClick={() => {
              setCurrentFilter(category)
            }}
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Dialog>
          {currentPromos.map((promo) => (
            <DialogTrigger key={promo.metadata.title} asChild>
              <Tile
                title={promo.metadata.title}
                onClick={() => {
                  trackCardClick(promo.trackingLabel)
                  setDialogContent(promo.content)
                }}
                variant="secondary"
                image={
                  <Image
                    src={promo.metadata.image || ''}
                    alt={promo.metadata.title}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                }
              />
            </DialogTrigger>
          ))}
          <DialogContent>{dialogContent}</DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export { PromotionsSection }
