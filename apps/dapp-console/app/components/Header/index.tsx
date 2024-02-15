'use client'

import Image from 'next/image'
import { ThemeToggle } from '@/app/components/Header/ThemeToggle'
import { Separator } from '@eth-optimism/ui-components/src/components/ui/separator'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text'
import { HeaderTabs } from '@/app/components/Header/HeaderTabs'
import { usePathname } from 'next/navigation'
import { SignInButton } from '@/app/components/Header/SignInButton'
import { MenuButton, MobileMenu } from '@/app/components/Header/MobileMenu'
import { useState } from 'react'

const Header = () => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="h-20 px-6 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-6 lg:gap-12 h-full">
          <span className="flex lg:hidden">
            <MenuButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
          </span>
          <HeaderLogo />
          <HeaderTabs currentRoute={pathname} />
        </div>
        <div className="flex items-center">
          <ThemeToggle />
          <Separator
            orientation="vertical"
            className="h-6 mx-4 hidden md:block"
          />
          <SignInButton />
        </div>
      </div>
      <MobileMenu isOpen={isOpen} closeMenu={() => setIsOpen(false)} />
    </>
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
      <Separator orientation="vertical" className="h-4 mx-4 hidden md:block" />
      <Text as="span" className="tracking-widest font-medium hidden md:block">
        DAPP DEVELOPER
      </Text>
    </div>
  )
}

export { Header }
