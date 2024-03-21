import Link from 'next/link'
import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'
import { cn } from '@eth-optimism/ui-components/src/lib/utils'
import { Separator } from '@eth-optimism/ui-components/src/components/ui/separator/separator'

import { routes } from '@/app/constants'
import { SettingsTabType } from '@/app/settings/types'

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
          'border-1 bg-primary rounded-full w-[6px] h-[6px]',
          isActive ? 'visibile' : 'invisible',
        )}
      ></div>
      <Text
        as="span"
        className={cn('pl-3 text-sm transition', isActive ? 'font-bold' : '')}
      >
        {title}
      </Text>
    </Link>
  </li>
)

export const SettingsMenu = ({
  activeTabType,
  className,
}: SettingsMenuProps) => (
  <div className={className}>
    <Text className="text-sm font-semibold p-3">Settings</Text>
    <Separator />
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
  </div>
)
