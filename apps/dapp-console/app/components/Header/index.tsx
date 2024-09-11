'use client'

import Image from 'next/image'
import { ThemeToggle } from '@/app/components/Header/ThemeToggle'
import { Separator } from '@eth-optimism/ui-components/src/components/ui/separator/separator'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'
import { HeaderTabs } from '@/app/components/Header/HeaderTabs'
import { usePathname } from 'next/navigation'
import { SignInButton } from '@/app/components/Header/SignInButton'
import { MenuButton, MobileMenu } from '@/app/components/Header/MobileMenu'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useFeatureFlag } from '@/app/hooks/useFeatureFlag'

const Header = () => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="h-20 px-6 pl-2 lg:pl-6 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-4 lg:gap-12 h-full">
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
  const showNewLogo = useFeatureFlag('enable_new_brand')
  const lightLogo = showNewLogo
    ? '/logos/new-op-superchain-logo-light.svg'
    : '/logos/op-superchain-logo-light.svg'
  const darkLogo = showNewLogo
    ? '/logos/new-op-superchain-logo-dark.svg'
    : '/logos/op-superchain-logo-dark.svg'

  const { resolvedTheme } = useTheme()
  const [logoSrc, setLogoSrc] = useState('')

  useEffect(() => {
    setLogoSrc(resolvedTheme === 'dark' ? darkLogo : lightLogo)
  }, [resolvedTheme, showNewLogo])

  const height = showNewLogo ? 40 : 24
  const width = showNewLogo ? 180 : 142

  return (
    <div className="flex items-center">
      <Link href="/" className="flex flex-row items-center">
        {logoSrc && (
          <Image
            src={logoSrc}
            alt="Superchain app developer logo"
            width={width}
            height={height}
          />
        )}
        {!showNewLogo && (
          <>
            <Separator
              orientation="vertical"
              className="h-4 mx-4 hidden md:block"
            />
            <Text
              as="span"
              className="tracking-widest font-medium hidden md:block"
            >
              DEVELOPER
            </Text>
          </>
        )}
      </Link>
    </div>
  )
}

export { Header }
