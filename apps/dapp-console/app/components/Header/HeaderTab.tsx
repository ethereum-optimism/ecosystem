import { Route, routes } from '@/app/constants'
import { cn } from '@/app/lib/utils'
import Link from 'next/link'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@eth-optimism/ui-components/src/components/ui/dropdown-menu'

import { Button } from '@eth-optimism/ui-components/src/components/ui/button'
import { RiArrowDownSLine } from '@remixicon/react'
import { useState } from 'react'

type HeaderTabsProps = {
  currentRoute: Route['path']
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

const SupportDropdownMenu = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

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
          <Text as="span">Support</Text>
        </DropdownMenuLabel>
        <DropdownMenuItem>heeeello</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { HeaderTabs, HeaderTabItem }
