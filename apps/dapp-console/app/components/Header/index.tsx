'use client'

import Image from 'next/image'
import { ThemeToggle } from '@/app/components/Header/ThemeToggle'
import { Separator } from '@eth-optimism/ui-components/src/components/ui/separator'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text'
import { Button } from '@eth-optimism/ui-components/src/components/ui/button'
import { HeaderTabs } from '@/app/components/Header/HeaderTabs'
import { usePathname } from 'next/navigation'

const Header = () => {
  const pathname = usePathname()

  return (
    <div className="h-20 px-6 border-b border-border flex items-center justify-between">
      <div className="flex items-center gap-12 h-full">
        <HeaderLogo />
        <HeaderTabs currentRoute={pathname} />
      </div>
      <div className="flex items-center">
        <ThemeToggle />
        <Separator orientation="vertical" className="h-6 mx-4" />
        <Button>
          <Text as="span">Sign in</Text>
        </Button>
      </div>
    </div>
  )
}

const HeaderLogo = () => {
  return (
    <div className="flex items-center">
      <Image
        src="logos/op-superchain-logo.svg"
        alt="Superchain dapp developer logo"
        width={200}
        height={24}
      />
      <Separator orientation="vertical" className="h-4 mx-4" />
      <Text as="span" className="tracking-widest font-medium">
        DAPP DEVELOPER
      </Text>
    </div>
  )
}

export { Header }
