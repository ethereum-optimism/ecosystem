import { docsItems, externalRoutes, routes } from '@/app/constants'
import { cn } from '@/app/lib/utils'
import Link from 'next/link'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text'
import Image from 'next/image'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@eth-optimism/ui-components/src/components/ui/dropdown-menu'

import { RiArrowDownSLine } from '@remixicon/react'
import { useState } from 'react'

type HeaderTabsProps = {
  currentRoute: string
}

const HeaderTabs = ({ currentRoute }: HeaderTabsProps) => {
  return (
    <div className="flex gap-8 items-end h-full">
      <HeaderTabItem
        href={routes.CONSOLE.path}
        isActive={currentRoute === routes.CONSOLE.path}
      >
        <Text as="span">{routes.CONSOLE.label}</Text>
      </HeaderTabItem>
      <HeaderTabItem
        href={routes.INSIGHTS.path}
        isActive={currentRoute === routes.INSIGHTS.path}
      >
        <Text as="span">{routes.INSIGHTS.label}</Text>
      </HeaderTabItem>
      <SupportDropdownMenu />
    </div>
  )
}

const baseClasses =
  'pb-6 text-muted-foreground font-medium border-b-4 border-transparent transition-all duration-200 ease-in-out'
const hoverClasses = 'hover:border-muted-foreground hover:text-foreground'
const activeClasses = 'border-foreground text-foreground'

type HeaderTabItemProps = {
  href?: string
  isActive?: boolean
  children: React.ReactNode
}

const HeaderTabItem = ({
  href = '',
  isActive,
  children,
}: HeaderTabItemProps) => {
  return (
    <Link
      href={href}
      className={cn(baseClasses, isActive ? activeClasses : hoverClasses)}
    >
      {children}
    </Link>
  )
}

const supportItems = [
  externalRoutes.DEV_FORUM,
  externalRoutes.FARCASTER,
  externalRoutes.DISCORD,
  externalRoutes.DAPP_EXAMPLES,
]

const SupportDropdownMenu = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const dropdownLabelClasses = 'text-xs text-muted-foreground uppercase'
  const dropdownItemClasses =
    'flex items-center gap-2 cursor-pointer h-12 px-4 text-base text-secondary-foreground'

  return (
    <DropdownMenu
      onOpenChange={(isOpen) => {
        setIsDropdownOpen(isOpen)
      }}
    >
      <DropdownMenuTrigger
        className={cn('flex items-center gap-2', baseClasses, hoverClasses)}
      >
        <Text as="span">Support</Text>
        <RiArrowDownSLine
          className={cn('h-4 w-4 transition-transform duration-200', {
            'rotate-180': isDropdownOpen,
          })}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>
          <Text as="span" className={dropdownLabelClasses}>
            SUPPORT
          </Text>
        </DropdownMenuLabel>
        {supportItems.map((item) => (
          <DropdownMenuItem key={item.path} asChild>
            <a href={item.path} target="_blank" className={dropdownItemClasses}>
              <Text as="span">{item.label}</Text>
            </a>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>
          <Text as="span" className={dropdownLabelClasses}>
            DOCS
          </Text>
        </DropdownMenuLabel>
        {docsItems.map((item) => (
          <DropdownMenuItem key={item.path} asChild>
            <a href={item.path} target="_blank" className={dropdownItemClasses}>
              <Image
                src={item.logo}
                alt={`${item.label} logo`}
                width={24}
                height={24}
                className="rounded-full"
              />
              <Text as="span">{item.label}</Text>
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { HeaderTabs, HeaderTabItem }
