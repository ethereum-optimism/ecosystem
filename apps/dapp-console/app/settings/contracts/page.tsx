'use client'

import { Text } from '@eth-optimism/ui-components/src/components/ui/text'
import { Button } from '@eth-optimism/ui-components'

import { ClaimedRebateProgressBanner } from '@/app/settings/components/ClaimedRebateProgressBanner'
import { CoinbaseVerificationBanner } from '@/app/settings/components/CoinbaseVerificationBanner'
import { Apps } from '@/app/settings/contracts/DApps'
import { RiAddLine } from '@remixicon/react'
import { ClaimedRebates } from '@/app/settings/components/ClaimedRebates'

export default function Contracts() {
  return (
    <div className="flex flex-col gap-2">
      <Text className="text-lg font-semibold">Your Apps</Text>

      <div className="flex flex-col gap-6">
        <Apps />

        <Button
          variant="outline"
          className="flex justify-between w-[120px] mb-8 rounded"
        >
          <RiAddLine /> App app
        </Button>
      </div>

      <Text className="text-lg font-semibold">Your Rebates</Text>
      <div className="flex flex-col gap-4">
        <CoinbaseVerificationBanner />
        <ClaimedRebateProgressBanner />
        <ClaimedRebates />
      </div>
    </div>
  )
}
