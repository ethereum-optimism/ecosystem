'use client'

import { externalRoutes } from '@/app/constants'
import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@eth-optimism/ui-components/src/components/ui/tooltip/tooltip'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@eth-optimism/ui-components/src/components/ui/dialog/dialog'
import { Button } from '@eth-optimism/ui-components/src/components/ui/button/button'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'

const joinedDescription = (joined: string) => {
  return `Joined the Superchain on ${joined}.`
}

const linkItems = [
  {
    ...externalRoutes.ETH_DOCS,
    logo: '/logos/eth-logo.png',
    description: 'The Superchain is scaling Ethereum',
  },
  {
    ...externalRoutes.BASE_DOCS,
    logo: '/logos/base-logo.png',
    description: joinedDescription('Feb 23, 2023'),
  },
  {
    ...externalRoutes.FRAX_DOCS,
    logo: '/logos/frax-logo.png',
    description: joinedDescription('Feb 7, 2024'),
  },
  {
    ...externalRoutes.LISK_DOCS,
    logo: '/logos/lisk-logo.png',
    description: joinedDescription('Dec 19, 2023'),
  },
  {
    ...externalRoutes.MODE_DOCS,
    logo: '/logos/mode-logo.png',
    description: joinedDescription('Jan 23, 2024'),
  },
  {
    ...externalRoutes.OPTIMISM_DOCS,
    logo: '/logos/op-logo.svg',
    description: joinedDescription('Feb 23, 2023'),
  },
  {
    ...externalRoutes.REDSTONE_DOCS,
    logo: '/logos/redstone-logo.png',
    description: joinedDescription('Nov 15, 2023'),
  },
  {
    ...externalRoutes.ZORA_DOCS,
    logo: '/logos/zora-logo.png',
    description: joinedDescription('June 21, 2023'),
  },
]

const ProjectIconLinks = () => {
  return (
    <div className="flex items-center relative">
      {linkItems.map((item, index) => {
        // Calculate z-index in reverse order, so leftmost has the highest z-index
        const zIndex = linkItems.length - index
        return (
          <IconLink
            logo={item.logo}
            label={item.label}
            href={item.path}
            key={item.logo}
            description={item.description}
            style={{ zIndex }}
          />
        )
      })}
    </div>
  )
}

type IconLinkProps = {
  logo: string
  label: string
  href: string
  description: string
  style: React.CSSProperties
}

const IconLink = ({ logo, label, href, description, style }: IconLinkProps) => {
  const hoverAnimation = {
    y: -10,
    transition: { type: 'spring', stiffness: 400, damping: 15 },
  }

  return (
    <Dialog>
      <TooltipProvider>
        <Tooltip>
          <DialogTrigger asChild>
            <TooltipTrigger asChild>
              <motion.button
                rel="noreferrer noopener"
                className="rounded-full overflow-hidden border border-border -ml-2"
                style={{ ...style, position: 'relative' }}
                whileHover={hoverAnimation}
              >
                <Image
                  src={logo}
                  alt={`${label} logo`}
                  height={40}
                  width={40}
                />
              </motion.button>
            </TooltipTrigger>
          </DialogTrigger>
          <TooltipContent>
            <p>{label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="sm:max-w-[425px]">
        <div className="flex flex-col justify-center items-center w-full">
          <Image
            src={logo}
            alt={`${label} logo`}
            height={80}
            width={80}
            className="rounded-full"
          />
          <Text as="h3" className="text-2xl font-semibold mt-4">
            {label}
          </Text>
          <Text as="p" className="text-muted-foreground text-center mt-2">
            {description}
          </Text>
        </div>
        <DialogFooter>
          <Button className="w-full" asChild size="lg">
            <a href={href} target="_blank" rel="noreferrer noopener">
              <Text as="span">Learn more</Text>
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { ProjectIconLinks }
