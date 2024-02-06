'use client'

import { externalRoutes } from '@/app/constants'
import { motion } from 'framer-motion'
import Image from 'next/image'

const linkItems = [
  {
    ...externalRoutes.ETH_DOCS,
    logo: '/logos/eth-logo.png',
  },
  {
    ...externalRoutes.BASE_DOCS,
    logo: '/logos/base-logo.png',
  },
  {
    ...externalRoutes.FRAX_DOCS,
    logo: '/logos/frax-logo.png',
  },
  {
    ...externalRoutes.LISK_DOCS,
    logo: '/logos/lisk-logo.png',
  },
  {
    ...externalRoutes.MODE_DOCS,
    logo: '/logos/mode-logo.png',
  },
  {
    ...externalRoutes.OPTIMISM_DOCS,
    logo: '/logos/op-logo.svg',
  },
  {
    ...externalRoutes.REDSTONE_DOCS,
    logo: '/logos/redstone-logo.png',
  },
  {
    ...externalRoutes.ZORA_DOCS,
    logo: '/logos/zora-logo.png',
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
  style: React.CSSProperties
}

const IconLink = ({ logo, label, href, key, style }: IconLinkProps) => {
  const hoverAnimation = {
    y: -10,
    transition: { type: 'spring', stiffness: 400, damping: 15 },
  }

  return (
    <motion.a
      href={href}
      target="_blank"
      key={key}
      rel="noreferrer noopener"
      className="rounded-full overflow-hidden border border-border -ml-2"
      style={{ ...style, position: 'relative' }}
      whileHover={hoverAnimation} // Apply the hover animation
    >
      <Image src={logo} alt={`${label} logo`} height={40} width={40} />
    </motion.a>
  )
}

export { ProjectIconLinks }
