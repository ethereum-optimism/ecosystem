import Link from 'next/link'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'
import { cn } from '@eth-optimism/ui-components/src/lib/utils'
import { Separator } from '@eth-optimism/ui-components/src/components/ui/separator/separator'

import { routes } from '@/app/constants'
import { SettingsTabType } from '@/app/settings/types'
import { useTheme } from 'next-themes'
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@eth-optimism/ui-components'
import { useMemo } from 'react'
import { RiArrowDownSLine } from '@remixicon/react'

export type SettingsMenuProps = {
  activeTabType: SettingsTabType
  className: string
}

const SettingsMenuItem = ({
  isActive,
  title,
  url,
}: Readonly<{
  isActive: boolean
  title: string
  url: string
}>) => (
  <li className="p-3">
    <Link className="flex flex-row items-center" href={url}>
      <div
        className={cn(
          'bg-foreground rounded-full w-[6px] h-[6px]',
          isActive ? 'visibile' : 'invisible',
        )}
      ></div>
      <Text
        as="span"
        className={cn(
          'pl-3 text-base transition cursor-pointer',
          isActive ? 'font-bold' : '',
        )}
      >
        {title}
      </Text>
    </Link>
  </li>
)

export const SettingsMenu = ({
  activeTabType,
  className,
}: SettingsMenuProps) => {
  const { resolvedTheme } = useTheme()

  return (
    <div className={className}>
      <Text className="text-base font-semibold p-3">Settings</Text>
      <Separator
        className={cn(
          'mb-3',
          resolvedTheme === 'dark' ? 'bg-foreground/20' : '',
        )}
      />
      <ul>
        <SettingsMenuItem
          isActive={activeTabType === 'wallets'}
          title={routes.WALLETS.label}
          url={routes.WALLETS.path}
        />
        <SettingsMenuItem
          isActive={activeTabType === 'contracts'}
          title={routes.CONTRACTS.label}
          url={routes.CONTRACTS.path}
        />
        <SettingsMenuItem
          isActive={activeTabType === 'account'}
          title={routes.ACCOUNT.label}
          url={routes.ACCOUNT.path}
        />
      </ul>
    </div>
  )
}

export const MobileSettingsMenu = ({
  activeTabType,
  className,
}: SettingsMenuProps) => {
  const activeRoute = useMemo(
    () => routes[activeTabType.toUpperCase()],
    [activeTabType],
  )

  return (
    <Dialog>
      <DialogTrigger className={className} asChild>
        <div className="flex flex-row w-full px-6">
          <Button variant="outline" className="w-full justify-between">
            <Text as="span">{activeRoute.label}</Text>
            <RiArrowDownSLine />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Text className="text-center">Settings</Text>
          </DialogTitle>
        </DialogHeader>

        <ul>
          <SettingsMenuItem
            isActive={activeTabType === 'account'}
            title={routes.ACCOUNT.label}
            url={routes.ACCOUNT.path}
          />
          <SettingsMenuItem
            isActive={activeTabType === 'contracts'}
            title={routes.CONTRACTS.label}
            url={routes.CONTRACTS.path}
          />
          <SettingsMenuItem
            isActive={activeTabType === 'wallets'}
            title={routes.WALLETS.label}
            url={routes.WALLETS.path}
          />
        </ul>
      </DialogContent>
    </Dialog>
  )
}
