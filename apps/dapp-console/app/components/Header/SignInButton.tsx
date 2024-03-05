'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@eth-optimism/ui-components/src/components/ui/dropdown-menu'
import { Button } from '@eth-optimism/ui-components/src/components/ui/button'
import { Separator } from '@eth-optimism/ui-components/src/components/ui/separator'
import { usePrivy } from '@privy-io/react-auth'
import { useState } from 'react'
import { cn } from '@eth-optimism/ui-components/src/lib/utils'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text'
import { RiArrowDownSLine, RiUser3Fill } from '@remixicon/react'
import { trackSignInClick } from '@/app/event-tracking/mixpanel'

const SignInButton = () => {
  const { login, logout, authenticated } = usePrivy()
  const handleLogin = () => {
    trackSignInClick()
    login()
  }
  return !authenticated ? (
    <Button onClick={handleLogin}>Sign in</Button>
  ) : (
    <AccountDropdown logout={logout} />
  )
}

type AccountDropdownProps = {
  logout: () => void
}

const AccountDropdown = ({ logout }: AccountDropdownProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownItemClasses =
    'flex items-center gap-2 cursor-pointer h-12 px-4 rounded-none text-base text-secondary-foreground'

  const shouldShowSettings = process.env.NEXT_PUBLIC_ENABLE_SETTINGS === 'true'

  return (
    <DropdownMenu
      onOpenChange={(isOpen) => {
        setIsDropdownOpen(isOpen)
      }}
    >
      <DropdownMenuTrigger asChild className={cn('flex items-center gap-2')}>
        <Button variant="outline">
          <RiUser3Fill size={20} />
          <RiArrowDownSLine
            className={cn('h-4 w-4 transition-transform duration-200', {
              'rotate-180': isDropdownOpen,
            })}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        {shouldShowSettings && (
          <>
            <DropdownMenuItem asChild>
              <Link className={dropdownItemClasses} href={routes.ACCOUNT.path}>
                <Text as="span">{routes.ACCOUNT.label}</Text>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                className={dropdownItemClasses}
                href={routes.CONTRACTS.path}
              >
                <Text as="span">{routes.CONTRACTS.label}</Text>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link className={dropdownItemClasses} href={routes.WALLETS.path}>
                <Text as="span">{routes.WALLETS.label}</Text>
              </Link>
            </DropdownMenuItem>
            <Separator />
          </>
        )}
        <DropdownMenuItem asChild>
          <div className={dropdownItemClasses} onClick={logout}>
            <Text as="span">Sign out</Text>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { SignInButton }
