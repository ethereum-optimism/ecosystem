'use client'

import { redirect, usePathname } from 'next/navigation'
import { useEffect, useMemo } from 'react'

import { Text } from '@eth-optimism/ui-components/src/components/ui/text/text'

import {
  MobileSettingsMenu,
  SettingsMenu,
} from '@/app/settings/components/SettingsMenu'
import {
  SettingsCard,
  SettingsCardDescription,
  SettingsCardTitle,
} from '@/app/settings/components/SettingsCard'
import { SettingsTabType, SettingsTab } from '@/app/settings/types'
import { useFeature } from '@/app/hooks/useFeatureFlag'
import { WalletVerificationMethods } from '@/app/settings/components/WalletVerificationMethods'
import { RebateDialog } from '@/app/settings/components/RebateDialog'

const tabs: Record<SettingsTabType, SettingsTab> = {
  account: {
    title: <SettingsCardTitle>Account</SettingsCardTitle>,
    type: 'account',
  },
  contracts: {
    title: <SettingsCardTitle>Contracts</SettingsCardTitle>,
    type: 'contracts',
    description: (
      <SettingsCardDescription>
        Add your app contracts here. In the future, we’ll scan them for
        insights. For now, we’ll check if they’re eligible for the{' '}
        <RebateDialog>
          <Text as="span" className="font-semibold cursor-pointer">
            Deployment Rebate.
          </Text>
        </RebateDialog>
      </SettingsCardDescription>
    ),
  },
  wallets: {
    title: <SettingsCardTitle>Wallets</SettingsCardTitle>,
    type: 'wallets',
    description: (
      <SettingsCardDescription>
        Link any wallets you want associated with your account. Superchain
        Developer will remember your addresses and use them to verify your
        onchain identity.
        <WalletVerificationMethods />
      </SettingsCardDescription>
    ),
  },
}

function getActiveTab(pathname: string): SettingsTab {
  const [route, _queryParams] = pathname.split('?')
  const [_, _settingsPrefix, activeRoute] = route.split('/')
  return tabs[activeRoute as SettingsTabType] as SettingsTab
}

export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const tab = useMemo(() => getActiveTab(pathname), [pathname])

  return (
    <main className="flex justify-center bg-secondary min-h-screen">
      <div className="flex flex-row w-full max-w-7xl mt-6 md:mt-36 md:mb-16">
        <SettingsMenu
          activeTabType={tab.type}
          className="hidden w-[246px] pl-10 md:block xl:pl-0"
        />

        <div className="flex flex-col w-full items-center md:mx-8">
          <MobileSettingsMenu
            activeTabType={tab.type}
            className="flex md:hidden mb-6"
          />
          <SettingsCard className="w-full z-10 min-h-full md:min-h-0" tab={tab}>
            {children}
          </SettingsCard>
        </div>
      </div>
    </main>
  )
}
