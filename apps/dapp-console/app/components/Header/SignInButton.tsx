'use client'

import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@eth-optimism/ui-components/src/components/ui/dropdown-menu/dropdown-menu'
import { Button } from '@eth-optimism/ui-components/src/components/ui/button/button'
import { Separator } from '@eth-optimism/ui-components/src/components/ui/separator/separator'
import { useLogin, useLogout, usePrivy } from '@privy-io/react-auth'
import { useState } from 'react'
import { cn } from '@eth-optimism/ui-components/src/lib/utils'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'
import { RiArrowDownSLine, RiUser3Fill } from '@remixicon/react'
import { trackSignInClick } from '@/app/event-tracking/mixpanel'
import { routes } from '@/app/constants'
import { useFeature } from '@/app/hooks/useFeatureFlag'
import { apiClient } from '@/app/helpers/apiClient'
import { captureError } from '@/app/helpers/errorReporting'
import { toast } from '@eth-optimism/ui-components'
import { LONG_DURATION } from '@/app/constants/toast'

const SignInButton = () => {
  const { authenticated } = usePrivy()
  const { mutateAsync: loginUser } = apiClient.auth.loginUser.useMutation()
  const { mutateAsync: logoutUser } = apiClient.auth.logoutUser.useMutation()
  const { login } = useLogin({
    onComplete: async () => {
      try {
        await loginUser()
      } catch (e) {
        toast({
          description: 'Sign in failed.',
          duration: LONG_DURATION,
        })
        captureError(e, 'loginUser')
        logout()
      }
    },
    onError: (privyError) => {
      captureError(privyError, 'privyLogin')
    },
  })
  const { logout } = useLogout({
    onSuccess: async () => {
      try {
        await logoutUser()
        window.location.href = '/'
      } catch (e) {
        captureError(e, 'logoutUser')
      }
    },
  })
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
  const shouldShowSettings = useFeature('enable_console_settings')

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownItemClasses =
    'flex items-center gap-2 cursor-pointer h-12 px-4 rounded-none text-base text-secondary-foreground'

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
