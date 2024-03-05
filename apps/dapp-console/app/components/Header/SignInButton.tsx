'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@eth-optimism/ui-components/src/components/ui/dropdown-menu'
import { Button } from '@eth-optimism/ui-components/src/components/ui/button'
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
    'flex items-center gap-2 cursor-pointer h-12 px-4 text-base text-secondary-foreground'

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
      <DropdownMenuContent align="end" className="w-80">
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
