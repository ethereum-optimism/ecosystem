import { Route, routes } from '@/app/constants'
import { cn } from '@/app/lib/utils'
import Link from 'next/link'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text'

type HeaderTabsProps = {
  currentRoute: Route['path']
}

const HeaderTabs = ({ currentRoute }: HeaderTabsProps) => {
  return (
    <div className="flex gap-8 items-end h-full">
      {Object.keys(routes).map((route) => {
        const { path, label } = routes[route]
        return (
          <HeaderTabItem
            key={path}
            href={path}
            isActive={currentRoute === path}
          >
            <Text as="span">{label}</Text>
          </HeaderTabItem>
        )
      })}
    </div>
  )
}

type HeaderTabItemProps = {
  href: string
  isActive?: boolean
  children: React.ReactNode
}

const HeaderTabItem = ({ href, isActive, children }: HeaderTabItemProps) => {
  const baseClasses =
    'pb-6 text-muted-foreground font-medium border-b-4 border-transparent transition-all duration-200 ease-in-out'
  const hoverClasses = 'hover:border-muted-foreground hover:text-foreground'
  const activeClasses = 'border-foreground text-foreground'

  return (
    <Link
      href={href}
      className={cn(baseClasses, isActive ? activeClasses : hoverClasses)}
    >
      {children}
    </Link>
  )
}

export { HeaderTabs, HeaderTabItem }
