import { cn } from '@/app/lib/utils'
import Link from 'next/link'

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

export { HeaderTabItem }
