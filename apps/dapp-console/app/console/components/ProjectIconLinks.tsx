'use client'

import { externalRoutes } from '@/app/constants'
import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@eth-optimism/ui-components/src/components/ui/tooltip'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@eth-optimism/ui-components/src/components/ui/dialog'
import { Button } from '@eth-optimism/ui-components/src/components/ui/button'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text'

const linkItems = [
  {
    ...externalRoutes.ETH_DOCS,
    logo: '/logos/eth-logo.png',
    joined: null,
  },
  {
    ...externalRoutes.BASE_DOCS,
    logo: '/logos/base-logo.png',
    joined: 'Feb 23, 2023',
  },
  {
    ...externalRoutes.FRAX_DOCS,
    logo: '/logos/frax-logo.png',
    joined: 'Feb 7, 2024',
  },
  {
    ...externalRoutes.LISK_DOCS,
    logo: '/logos/lisk-logo.png',
    joined: 'Dec 19, 2024',
  },
  {
    ...externalRoutes.MODE_DOCS,
    logo: '/logos/mode-logo.png',
    joined: 'Jan 23, 2024',
  },
  {
    ...externalRoutes.OPTIMISM_DOCS,
    logo: '/logos/op-logo.svg',
    joined: 'Feb 23, 2023',
  },
  {
    ...externalRoutes.REDSTONE_DOCS,
    logo: '/logos/redstone-logo.png',
    joined: 'Nov 15, 2023',
  },
  {
    ...externalRoutes.ZORA_DOCS,
    logo: '/logos/zora-logo.png',
    joined: 'June 21, 2023',
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
            joined={item.joined}
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
  key: string
  joined: string | null
  style: React.CSSProperties
}

const IconLink = ({ logo, label, href, key, joined, style }: IconLinkProps) => {
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
                key={key}
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
          {joined && (
            <Text as="p" className="text-muted-foreground text-center mt-2">
              Joined the Superchain on {joined}.
            </Text>
          )}
        </div>
        <DialogFooter>
          <Button className="w-full" asChild>
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
